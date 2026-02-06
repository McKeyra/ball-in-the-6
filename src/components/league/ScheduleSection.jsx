import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Calendar } from 'lucide-react';
import NaturalLanguageScheduler from './NaturalLanguageScheduler';
import TraditionalScheduler from './TraditionalScheduler';

export default function ScheduleSection() {
  return (
    <div>
      <Tabs defaultValue="traditional" className="w-full">
        <TabsList 
          className="grid w-full grid-cols-2 mb-6"
          style={{
            background: '#e0e0e0',
            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
            padding: '4px',
            borderRadius: '12px'
          }}
        >
          <TabsTrigger value="traditional" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Traditional Form
          </TabsTrigger>
          <TabsTrigger value="natural" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Natural Language
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traditional">
          <TraditionalScheduler />
        </TabsContent>

        <TabsContent value="natural">
          <NaturalLanguageScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
}