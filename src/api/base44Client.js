import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co';

// Use ball_in_the_6 schema instead of public
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'ball_in_the_6'
  }
});

// Convert PascalCase entity name to snake_case table name
function toTableName(entityName) {
  return entityName
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

// Create CRUD methods for a Supabase table matching the Base44 entity API
function createEntityAccessor(tableName) {
  return {
    async list(sortOrOptions, limit) {
      let query = supabase.from(tableName).select('*');

      if (typeof sortOrOptions === 'string') {
        const desc = sortOrOptions.startsWith('-');
        const field = desc ? sortOrOptions.slice(1) : sortOrOptions;
        query = query.order(field, { ascending: !desc });
        if (limit) query = query.limit(limit);
      } else if (sortOrOptions && typeof sortOrOptions === 'object') {
        if (sortOrOptions.sort) {
          for (const [field, dir] of Object.entries(sortOrOptions.sort)) {
            query = query.order(field, { ascending: dir !== -1 });
          }
        }
        if (sortOrOptions.limit) query = query.limit(sortOrOptions.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async filter(filterObj, sort, limit) {
      let query = supabase.from(tableName).select('*');

      for (const [key, value] of Object.entries(filterObj)) {
        query = query.eq(key, value);
      }

      if (typeof sort === 'string') {
        const desc = sort.startsWith('-');
        const field = desc ? sort.slice(1) : sort;
        query = query.order(field, { ascending: !desc });
      }

      if (typeof limit === 'number') query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async get(id) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },

    async create(record) {
      const { data, error } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async bulkCreate(records) {
      const { data, error } = await supabase
        .from(tableName)
        .insert(records)
        .select();
      if (error) throw error;
      return data || [];
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  };
}

// Dynamic proxy: base44.entities.AnyEntityName -> supabase table "any_entity_name"
const entityCache = {};
const entitiesProxy = new Proxy(
  {},
  {
    get(_target, entityName) {
      if (typeof entityName !== 'string') return undefined;
      if (!entityCache[entityName]) {
        entityCache[entityName] = createEntityAccessor(toTableName(entityName));
      }
      return entityCache[entityName];
    },
  }
);

// Auth — wraps Supabase Auth to match the Base44 auth interface
const auth = {
  async me() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;

    // Fetch role from user_roles table
    let userRole = 'fan';
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role, full_name, organization_id, team_id')
        .eq('email', user.email)
        .eq('is_active', true)
        .single();

      if (roleData) {
        userRole = roleData.role;
      }
    } catch {
      // If role lookup fails, default to fan
    }

    return {
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email,
      role: userRole,
      user_role: userRole, // For Layout.jsx compatibility
      ...user.user_metadata,
    };
  },

  async logout(redirectUrl) {
    await supabase.auth.signOut();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },

  redirectToLogin(redirectUrl) {
    if (redirectUrl) {
      localStorage.setItem('auth_redirect', redirectUrl);
    }
    window.location.href = '/login';
  },
};

// Integrations — route through Supabase Edge Functions
const integrations = {
  Core: {
    async InvokeLLM({ prompt, response_json_schema }) {
      const { data, error } = await supabase.functions.invoke('invoke-llm', {
        body: { prompt, response_json_schema },
      });
      if (error) throw error;
      return data;
    },

    async SendEmail(params) {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: params,
      });
      if (error) throw error;
      return data;
    },

    async SendSMS(params) {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: params,
      });
      if (error) throw error;
      return data;
    },

    async UploadFile({ file }) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from('uploads').getPublicUrl(data.path);
      return { file_url: publicUrl };
    },

    async GenerateImage(params) {
      const { data, error } = await supabase.functions.invoke(
        'generate-image',
        { body: params }
      );
      if (error) throw error;
      return data;
    },

    async ExtractDataFromUploadedFile(params) {
      const { data, error } = await supabase.functions.invoke('extract-data', {
        body: params,
      });
      if (error) throw error;
      return data;
    },
  },
};

// Cloud functions — route through Supabase Edge Functions
const functions = {
  async invoke(functionName, params) {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: params,
    });
    if (error) throw error;
    return { data };
  },
};

// App logs — no-op (Base44-specific telemetry not needed)
const appLogs = {
  async logUserInApp() {},
};

export const base44 = {
  entities: entitiesProxy,
  auth,
  integrations,
  functions,
  appLogs,
};
