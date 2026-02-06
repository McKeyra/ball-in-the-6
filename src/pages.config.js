import AddNewProgram from './pages/AddNewProgram';
import Awards from './pages/Awards';
import BoxScore from './pages/BoxScore';
import CleanupDuplicates from './pages/CleanupDuplicates';
import CoachDashboard from './pages/CoachDashboard';
import Content from './pages/Content';
import CourtView from './pages/CourtView';
import CreateTeam from './pages/CreateTeam';
import Dashboard from './pages/Dashboard';
import DetailedGameView from './pages/DetailedGameView';
import EditTeam from './pages/EditTeam';
import FanPages from './pages/FanPages';
import FanZone from './pages/FanZone';
import Feed from './pages/Feed';
import Forum from './pages/Forum';
import GameSetup from './pages/GameSetup';
import GameView from './pages/GameView';
import Home from './pages/Home';
import LeagueCommissionerDashboard from './pages/LeagueCommissionerDashboard';
import LeagueManagement from './pages/LeagueManagement';
import LiveGame from './pages/LiveGame';
import LiveStats from './pages/LiveStats';
import Manual from './pages/Manual';
import Messenger from './pages/Messenger';
import OGH from './pages/OGH';
import OrgDashboard from './pages/OrgDashboard';
import OrgPresidentDashboard from './pages/OrgPresidentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import PlayerDashboard from './pages/PlayerDashboard';
import PlayerDevelopment from './pages/PlayerDevelopment';
import PlayerManagement from './pages/PlayerManagement';
import PlayerProfile from './pages/PlayerProfile';
import PlayerProfiles from './pages/PlayerProfiles';
import PlayerSheet from './pages/PlayerSheet';
import Programs from './pages/Programs';
import Schedule from './pages/Schedule';
import Standings from './pages/Standings';
import Store from './pages/Store';
import TeamDashboard from './pages/TeamDashboard';
import TeamDetail from './pages/TeamDetail';
import TeamList from './pages/TeamList';
import TeamManagement from './pages/TeamManagement';
import TeamManagerDashboard from './pages/TeamManagerDashboard';
import TeamOverview from './pages/TeamOverview';
import TeamPerformance from './pages/TeamPerformance';
import Teams from './pages/Teams';
import SponsorPipeline from './pages/SponsorPipeline';
import TeamHealthDashboard from './pages/TeamHealthDashboard';
import TeamRegistration from './pages/TeamRegistration';

// Form Pages - Registration
import PlayerRegistration from './pages/forms/PlayerRegistration';
import CoachRegistration from './pages/forms/CoachRegistration';
import RefereeRegistration from './pages/forms/RefereeRegistration';
import VolunteerRegistration from './pages/forms/VolunteerRegistration';
import TryoutRegistration from './pages/forms/TryoutRegistration';
import ProgramSignup from './pages/forms/ProgramSignup';

// Form Pages - Applications
import SponsorApplication from './pages/forms/SponsorApplication';
import LeagueApplication from './pages/forms/LeagueApplication';
import FacilityPartner from './pages/forms/FacilityPartner';
import VendorApplication from './pages/forms/VendorApplication';

// Form Pages - Operational
import GameReport from './pages/forms/GameReport';
import IncidentReport from './pages/forms/IncidentReport';
import TransferRequest from './pages/forms/TransferRequest';
import ScheduleRequest from './pages/forms/ScheduleRequest';
import EquipmentRequest from './pages/forms/EquipmentRequest';
import FacilityBooking from './pages/forms/FacilityBooking';

// Form Pages - Feedback
import SeasonSurvey from './pages/forms/SeasonSurvey';
import CoachEvaluation from './pages/forms/CoachEvaluation';
import EventFeedback from './pages/forms/EventFeedback';
import NPSSurvey from './pages/forms/NPSSurvey';

// Form Pages - Settings
import ParentProfileSetup from './pages/forms/ParentProfileSetup';
import TeamSettingsForm from './pages/forms/TeamSettingsForm';
import LeagueSettingsForm from './pages/forms/LeagueSettingsForm';
import OrganizationSetup from './pages/forms/OrganizationSetup';

// Form Pages - Compliance
import WaiverConsent from './pages/forms/WaiverConsent';
import MedicalForm from './pages/forms/MedicalForm';
import CodeOfConduct from './pages/forms/CodeOfConduct';
import BackgroundCheck from './pages/forms/BackgroundCheck';

// Form Pages - Recognition
import AwardNomination from './pages/forms/AwardNomination';
import HallOfFame from './pages/forms/HallOfFame';

import __Layout from './Layout.jsx';


export const PAGES = {
    "AddNewProgram": AddNewProgram,
    "Awards": Awards,
    "BoxScore": BoxScore,
    "CleanupDuplicates": CleanupDuplicates,
    "CoachDashboard": CoachDashboard,
    "Content": Content,
    "CourtView": CourtView,
    "CreateTeam": CreateTeam,
    "Dashboard": Dashboard,
    "DetailedGameView": DetailedGameView,
    "EditTeam": EditTeam,
    "FanPages": FanPages,
    "FanZone": FanZone,
    "Feed": Feed,
    "Forum": Forum,
    "GameSetup": GameSetup,
    "GameView": GameView,
    "Home": Home,
    "LeagueCommissionerDashboard": LeagueCommissionerDashboard,
    "LeagueManagement": LeagueManagement,
    "LiveGame": LiveGame,
    "LiveStats": LiveStats,
    "Manual": Manual,
    "Messenger": Messenger,
    "OGH": OGH,
    "OrgDashboard": OrgDashboard,
    "OrgPresidentDashboard": OrgPresidentDashboard,
    "ParentDashboard": ParentDashboard,
    "PlayerDashboard": PlayerDashboard,
    "PlayerDevelopment": PlayerDevelopment,
    "PlayerManagement": PlayerManagement,
    "PlayerProfile": PlayerProfile,
    "PlayerProfiles": PlayerProfiles,
    "PlayerSheet": PlayerSheet,
    "Programs": Programs,
    "Schedule": Schedule,
    "Standings": Standings,
    "Store": Store,
    "TeamDashboard": TeamDashboard,
    "TeamDetail": TeamDetail,
    "TeamList": TeamList,
    "TeamManagement": TeamManagement,
    "TeamManagerDashboard": TeamManagerDashboard,
    "TeamOverview": TeamOverview,
    "TeamPerformance": TeamPerformance,
    "Teams": Teams,
    "SponsorPipeline": SponsorPipeline,
    "TeamHealthDashboard": TeamHealthDashboard,
    "TeamRegistration": TeamRegistration,
    // Registration Forms
    "PlayerRegistration": PlayerRegistration,
    "CoachRegistration": CoachRegistration,
    "RefereeRegistration": RefereeRegistration,
    "VolunteerRegistration": VolunteerRegistration,
    "TryoutRegistration": TryoutRegistration,
    "ProgramSignup": ProgramSignup,
    // Application Forms
    "SponsorApplication": SponsorApplication,
    "LeagueApplication": LeagueApplication,
    "FacilityPartner": FacilityPartner,
    "VendorApplication": VendorApplication,
    // Operational Forms
    "GameReport": GameReport,
    "IncidentReport": IncidentReport,
    "TransferRequest": TransferRequest,
    "ScheduleRequest": ScheduleRequest,
    "EquipmentRequest": EquipmentRequest,
    "FacilityBooking": FacilityBooking,
    // Feedback Forms
    "SeasonSurvey": SeasonSurvey,
    "CoachEvaluation": CoachEvaluation,
    "EventFeedback": EventFeedback,
    "NPSSurvey": NPSSurvey,
    // Settings Forms
    "ParentProfileSetup": ParentProfileSetup,
    "TeamSettingsForm": TeamSettingsForm,
    "LeagueSettingsForm": LeagueSettingsForm,
    "OrganizationSetup": OrganizationSetup,
    // Compliance Forms
    "WaiverConsent": WaiverConsent,
    "MedicalForm": MedicalForm,
    "CodeOfConduct": CodeOfConduct,
    "BackgroundCheck": BackgroundCheck,
    // Recognition Forms
    "AwardNomination": AwardNomination,
    "HallOfFame": HallOfFame,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
