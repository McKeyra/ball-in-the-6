import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertCircle, Database, Users, Trophy, Calendar } from "lucide-react";

const OSBA_TEAMS = [
  {
    name: "Crestwood Prep",
    team_name: "Crestwood Prep",
    abbreviation: "CWP",
    league: "OSBA",
    division: "East",
    primary_color: "#1E3A5F",
    gradientStart: "#1E3A5F",
    gradientEnd: "#2D5A8E",
    city: "Toronto",
    province: "ON",
    wins: 6, losses: 4,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Christopher", last_name: "Tshibola", jersey_number: "1", position: "PG", height: "6'2\"" },
      { first_name: "Colton", last_name: "Crowdis", jersey_number: "3", position: "PG", height: "6'0\"" },
      { first_name: "Mangok", last_name: "Lok Gach", jersey_number: "10", position: "SF", height: "6'6\"" },
      { first_name: "Ben", last_name: "Van Bulck", jersey_number: "15", position: "C", height: "6'9\"" },
      { first_name: "Isaiah", last_name: "Hamilton", jersey_number: "2", position: "SF", height: "6'6\"" },
      { first_name: "Lana", last_name: "Agbalese", jersey_number: "24", position: "PF", height: "6'5\"" },
      { first_name: "Marcus", last_name: "Williams", jersey_number: "5", position: "SG", height: "6'3\"" },
      { first_name: "Devon", last_name: "Clarke", jersey_number: "11", position: "PG", height: "6'1\"" },
      { first_name: "Jaylen", last_name: "Brooks", jersey_number: "22", position: "SF", height: "6'4\"" },
      { first_name: "Andre", last_name: "Thompson", jersey_number: "33", position: "C", height: "6'8\"" },
    ]
  },
  {
    name: "Ridley College",
    team_name: "Ridley College",
    abbreviation: "RID",
    league: "OSBA",
    division: "West",
    primary_color: "#8B0000",
    gradientStart: "#8B0000",
    gradientEnd: "#B22222",
    city: "St. Catharines",
    province: "ON",
    wins: 7, losses: 3,
    staff: [
      { name: "Victor Raso", title: "Head Coach" },
      { name: "Joel Friesen", title: "Assistant Coach" },
      { name: "Nicholas Ronald", title: "Program Assistant" },
    ],
    players: [
      { first_name: "Griffin", last_name: "Collinson", jersey_number: "4", position: "SG", height: "6'4\"" },
      { first_name: "Caleb", last_name: "Roberts", jersey_number: "12", position: "SF", height: "6'5\"" },
      { first_name: "Quinten", last_name: "Ethier", jersey_number: "23", position: "PF", height: "6'7\"" },
      { first_name: "Jaxen", last_name: "Baker", jersey_number: "7", position: "PG", height: "6'1\"" },
      { first_name: "Nathan", last_name: "Frew", jersey_number: "14", position: "SG", height: "6'3\"" },
      { first_name: "Josh", last_name: "Loblaw", jersey_number: "21", position: "PF", height: "6'6\"" },
      { first_name: "Amir", last_name: "Johnson", jersey_number: "0", position: "PG", height: "6'0\"" },
      { first_name: "Dante", last_name: "Mitchell", jersey_number: "32", position: "C", height: "6'9\"" },
      { first_name: "Tyler", last_name: "Santos", jersey_number: "11", position: "SF", height: "6'4\"" },
      { first_name: "Ryan", last_name: "Peters", jersey_number: "5", position: "SG", height: "6'2\"" },
    ]
  },
  {
    name: "Royal Crown School",
    team_name: "Royal Crown School",
    abbreviation: "RCS",
    league: "OSBA",
    division: "East",
    primary_color: "#DAA520",
    gradientStart: "#DAA520",
    gradientEnd: "#FFD700",
    city: "Toronto",
    province: "ON",
    wins: 9, losses: 1,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Justus", last_name: "Haseley", jersey_number: "1", position: "PG", height: "6'2\"" },
      { first_name: "Kymani", last_name: "Walters", jersey_number: "3", position: "SG", height: "6'3\"" },
      { first_name: "Yann-Ariel", last_name: "Kouakou-Aphely", jersey_number: "13", position: "C", height: "6'10\"" },
      { first_name: "Xavier", last_name: "Istomin-Monroe", jersey_number: "22", position: "PF", height: "6'7\"" },
      { first_name: "Cairo", last_name: "Perry", jersey_number: "5", position: "SG", height: "6'4\"" },
      { first_name: "Dwayne", last_name: "Richards", jersey_number: "11", position: "SF", height: "6'5\"" },
      { first_name: "Marcus", last_name: "James", jersey_number: "24", position: "PF", height: "6'6\"" },
      { first_name: "Tyrell", last_name: "Gordon", jersey_number: "7", position: "PG", height: "6'0\"" },
      { first_name: "Aiden", last_name: "Stewart", jersey_number: "30", position: "C", height: "6'8\"" },
      { first_name: "Brandon", last_name: "Lewis", jersey_number: "15", position: "SF", height: "6'4\"" },
    ]
  },
  {
    name: "William Academy",
    team_name: "William Academy",
    abbreviation: "WAC",
    league: "OSBA",
    division: "East",
    primary_color: "#2E8B57",
    gradientStart: "#2E8B57",
    gradientEnd: "#3CB371",
    city: "Toronto",
    province: "ON",
    wins: 6, losses: 5,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Efeosa", last_name: "Oliogu", jersey_number: "4", position: "SF", height: "6'6\"" },
      { first_name: "Tristan", last_name: "Darko", jersey_number: "10", position: "PG", height: "6'2\"" },
      { first_name: "Keoni", last_name: "Sacco", jersey_number: "21", position: "PF", height: "6'7\"" },
      { first_name: "Jenovie", last_name: "Kabeya", jersey_number: "7", position: "SG", height: "6'4\"" },
      { first_name: "Stephan", last_name: "Fearon", jersey_number: "12", position: "SG", height: "6'3\"" },
      { first_name: "Dante", last_name: "Williams", jersey_number: "23", position: "PF", height: "6'6\"" },
      { first_name: "Xavier", last_name: "Brown", jersey_number: "1", position: "PG", height: "6'1\"" },
      { first_name: "Jordan", last_name: "Campbell", jersey_number: "33", position: "C", height: "6'8\"" },
      { first_name: "Isaiah", last_name: "Moore", jersey_number: "5", position: "SF", height: "6'5\"" },
      { first_name: "Tyrese", last_name: "Jackson", jersey_number: "15", position: "SG", height: "6'3\"" },
    ]
  },
  {
    name: "Lincoln Prep",
    team_name: "Lincoln Prep",
    abbreviation: "LPC",
    league: "OSBA",
    division: "West",
    primary_color: "#4169E1",
    gradientStart: "#4169E1",
    gradientEnd: "#6495ED",
    city: "Hamilton",
    province: "ON",
    wins: 5, losses: 5,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Owen", last_name: "Frayne", jersey_number: "2", position: "PG", height: "6'1\"" },
      { first_name: "Nate", last_name: "Stoddart", jersey_number: "25", position: "C", height: "6'9\"" },
      { first_name: "Jayden", last_name: "Harris", jersey_number: "11", position: "SG", height: "6'3\"" },
      { first_name: "Marcus", last_name: "Reid", jersey_number: "7", position: "SF", height: "6'5\"" },
      { first_name: "Devon", last_name: "Scott", jersey_number: "14", position: "PF", height: "6'6\"" },
      { first_name: "Chris", last_name: "Anderson", jersey_number: "3", position: "PG", height: "6'0\"" },
      { first_name: "Alex", last_name: "Mitchell", jersey_number: "22", position: "SG", height: "6'2\"" },
      { first_name: "Isaiah", last_name: "Green", jersey_number: "30", position: "PF", height: "6'7\"" },
      { first_name: "Jordan", last_name: "White", jersey_number: "5", position: "SF", height: "6'4\"" },
      { first_name: "Malik", last_name: "Thomas", jersey_number: "33", position: "C", height: "6'8\"" },
    ]
  },
  {
    name: "Orangeville Prep",
    team_name: "Orangeville Prep",
    abbreviation: "OVP",
    league: "OSBA",
    division: "West",
    primary_color: "#FF6600",
    gradientStart: "#FF6600",
    gradientEnd: "#FF8C00",
    city: "Orangeville",
    province: "ON",
    wins: 5, losses: 5,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Noah", last_name: "D'Acre", jersey_number: "5", position: "SG", height: "6'4\"" },
      { first_name: "Jordan", last_name: "Langley-Thomas", jersey_number: "3", position: "PG", height: "6'1\"" },
      { first_name: "Lukas", last_name: "Jendrusiak", jersey_number: "8", position: "SG", height: "6'4\"" },
      { first_name: "Ylan", last_name: "Balde", jersey_number: "12", position: "SF", height: "6'5\"" },
      { first_name: "Amari", last_name: "Upshaw", jersey_number: "22", position: "PF", height: "6'6\"" },
      { first_name: "Kome", last_name: "Epule", jersey_number: "10", position: "SF", height: "6'5\"" },
      { first_name: "Darius", last_name: "Grant", jersey_number: "14", position: "PG", height: "6'0\"" },
      { first_name: "Trey", last_name: "Barnes", jersey_number: "24", position: "PF", height: "6'7\"" },
      { first_name: "RJ", last_name: "Patterson", jersey_number: "1", position: "SG", height: "6'3\"" },
      { first_name: "Kyle", last_name: "Davidson", jersey_number: "33", position: "C", height: "6'9\"" },
    ]
  },
  {
    name: "C.O.D.E. Academy",
    team_name: "C.O.D.E. Academy",
    abbreviation: "CODE",
    league: "OSBA",
    division: "East",
    primary_color: "#800080",
    gradientStart: "#800080",
    gradientEnd: "#9932CC",
    city: "Brampton",
    province: "ON",
    wins: 5, losses: 5,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Darius", last_name: "Brown", jersey_number: "1", position: "PG", height: "6'1\"" },
      { first_name: "Jalen", last_name: "Carter", jersey_number: "4", position: "SG", height: "6'3\"" },
      { first_name: "KJ", last_name: "Adams", jersey_number: "11", position: "SF", height: "6'5\"" },
      { first_name: "Trey", last_name: "Robinson", jersey_number: "22", position: "PF", height: "6'7\"" },
      { first_name: "Devon", last_name: "Taylor", jersey_number: "25", position: "C", height: "6'8\"" },
      { first_name: "Marcus", last_name: "Ellis", jersey_number: "3", position: "PG", height: "6'0\"" },
      { first_name: "Xavier", last_name: "Wright", jersey_number: "14", position: "SG", height: "6'4\"" },
      { first_name: "Noah", last_name: "Harris", jersey_number: "7", position: "SF", height: "6'5\"" },
      { first_name: "Jaylen", last_name: "Davis", jersey_number: "30", position: "PF", height: "6'6\"" },
      { first_name: "Isaiah", last_name: "Martin", jersey_number: "33", position: "C", height: "6'9\"" },
    ]
  },
  {
    name: "Brampton City Prep National",
    team_name: "Brampton City Prep National",
    abbreviation: "BCP",
    league: "OSBA",
    division: "West",
    primary_color: "#DC143C",
    gradientStart: "#DC143C",
    gradientEnd: "#FF4500",
    city: "Brampton",
    province: "ON",
    wins: 4, losses: 6,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Jaiden", last_name: "Kandasamy", jersey_number: "2", position: "SG", height: "6'3\"" },
      { first_name: "Tyrese", last_name: "Wilson", jersey_number: "5", position: "PG", height: "6'1\"" },
      { first_name: "Quincy", last_name: "Adams", jersey_number: "11", position: "SF", height: "6'5\"" },
      { first_name: "Deshawn", last_name: "Pierre", jersey_number: "23", position: "PF", height: "6'7\"" },
      { first_name: "Elijah", last_name: "Murray", jersey_number: "32", position: "C", height: "6'9\"" },
      { first_name: "Marcus", last_name: "Lee", jersey_number: "7", position: "SG", height: "6'3\"" },
      { first_name: "Andre", last_name: "Watson", jersey_number: "14", position: "PG", height: "6'0\"" },
      { first_name: "Jordan", last_name: "Phillips", jersey_number: "21", position: "SF", height: "6'4\"" },
      { first_name: "Chris", last_name: "Daniels", jersey_number: "30", position: "PF", height: "6'6\"" },
      { first_name: "Malik", last_name: "Williams", jersey_number: "44", position: "C", height: "6'8\"" },
    ]
  },
  {
    name: "Canada Topflight Academy Gold",
    team_name: "Canada Topflight Academy Gold",
    abbreviation: "CTA",
    league: "OSBA",
    division: "West",
    primary_color: "#B8860B",
    gradientStart: "#B8860B",
    gradientEnd: "#DAA520",
    city: "Toronto",
    province: "ON",
    wins: 3, losses: 7,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Jaylen", last_name: "Morris", jersey_number: "1", position: "PG", height: "6'0\"" },
      { first_name: "Kaden", last_name: "Foster", jersey_number: "5", position: "SG", height: "6'3\"" },
      { first_name: "Terrence", last_name: "Hughes", jersey_number: "10", position: "SF", height: "6'5\"" },
      { first_name: "Omar", last_name: "Johnson", jersey_number: "22", position: "PF", height: "6'6\"" },
      { first_name: "Andre", last_name: "Kim", jersey_number: "25", position: "C", height: "6'8\"" },
      { first_name: "Tyrone", last_name: "Davis", jersey_number: "3", position: "PG", height: "6'1\"" },
      { first_name: "JD", last_name: "Simmons", jersey_number: "14", position: "SG", height: "6'4\"" },
      { first_name: "Kevin", last_name: "Chen", jersey_number: "20", position: "SF", height: "6'5\"" },
      { first_name: "Brandon", last_name: "Stewart", jersey_number: "33", position: "PF", height: "6'7\"" },
      { first_name: "Isaac", last_name: "Wilson", jersey_number: "44", position: "C", height: "6'9\"" },
    ]
  },
  {
    name: "Fort Erie I.A.",
    team_name: "Fort Erie International Academy",
    abbreviation: "FEIA",
    league: "OSBA",
    division: "West",
    primary_color: "#006400",
    gradientStart: "#006400",
    gradientEnd: "#228B22",
    city: "Fort Erie",
    province: "ON",
    wins: 5, losses: 5,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Grady", last_name: "Kapuanya", jersey_number: "11", position: "PF", height: "6'7\"" },
      { first_name: "Tariq", last_name: "Robinson", jersey_number: "2", position: "PG", height: "6'0\"" },
      { first_name: "Emmanuel", last_name: "Osei", jersey_number: "7", position: "SG", height: "6'3\"" },
      { first_name: "David", last_name: "Mensah", jersey_number: "15", position: "SF", height: "6'5\"" },
      { first_name: "Samuel", last_name: "Adjei", jersey_number: "24", position: "C", height: "6'9\"" },
      { first_name: "Kofi", last_name: "Asante", jersey_number: "3", position: "PG", height: "6'1\"" },
      { first_name: "Daniel", last_name: "Kwame", jersey_number: "13", position: "SG", height: "6'4\"" },
      { first_name: "Eric", last_name: "Boateng", jersey_number: "20", position: "PF", height: "6'6\"" },
      { first_name: "Michael", last_name: "Frimpong", jersey_number: "30", position: "SF", height: "6'5\"" },
      { first_name: "Paul", last_name: "Agyeman", jersey_number: "44", position: "C", height: "6'8\"" },
    ]
  },
  {
    name: "Hodan Prep",
    team_name: "Hodan Prep",
    abbreviation: "HOD",
    league: "OSBA",
    division: "East",
    primary_color: "#4B0082",
    gradientStart: "#4B0082",
    gradientEnd: "#6A5ACD",
    city: "Toronto",
    province: "ON",
    wins: 5, losses: 5,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Hassan", last_name: "Ali", jersey_number: "1", position: "PG", height: "6'1\"" },
      { first_name: "Abdi", last_name: "Mohamed", jersey_number: "5", position: "SG", height: "6'3\"" },
      { first_name: "Yusuf", last_name: "Ahmed", jersey_number: "10", position: "SF", height: "6'5\"" },
      { first_name: "Omar", last_name: "Farah", jersey_number: "22", position: "PF", height: "6'7\"" },
      { first_name: "Khalid", last_name: "Hassan", jersey_number: "25", position: "C", height: "6'9\"" },
      { first_name: "Ismail", last_name: "Jama", jersey_number: "3", position: "PG", height: "6'0\"" },
      { first_name: "Mahad", last_name: "Osman", jersey_number: "14", position: "SG", height: "6'4\"" },
      { first_name: "Zakariye", last_name: "Aden", jersey_number: "21", position: "SF", height: "6'5\"" },
      { first_name: "Liban", last_name: "Warsame", jersey_number: "33", position: "PF", height: "6'6\"" },
      { first_name: "Jamal", last_name: "Yusuf", jersey_number: "44", position: "C", height: "6'8\"" },
    ]
  },
  {
    name: "Inspire Academy",
    team_name: "Inspire Academy",
    abbreviation: "INS",
    league: "OSBA",
    division: "West",
    primary_color: "#008B8B",
    gradientStart: "#008B8B",
    gradientEnd: "#20B2AA",
    city: "Toronto",
    province: "ON",
    wins: 5, losses: 5,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Malik", last_name: "Johnson", jersey_number: "1", position: "PG", height: "6'1\"" },
      { first_name: "Trey", last_name: "Anderson", jersey_number: "4", position: "SG", height: "6'3\"" },
      { first_name: "Darius", last_name: "Mitchell", jersey_number: "11", position: "SF", height: "6'5\"" },
      { first_name: "Xavier", last_name: "Thompson", jersey_number: "24", position: "PF", height: "6'7\"" },
      { first_name: "Jordan", last_name: "Carter", jersey_number: "32", position: "C", height: "6'9\"" },
      { first_name: "Chris", last_name: "Young", jersey_number: "3", position: "PG", height: "6'0\"" },
      { first_name: "Devon", last_name: "White", jersey_number: "7", position: "SG", height: "6'4\"" },
      { first_name: "Aaron", last_name: "Davis", jersey_number: "15", position: "SF", height: "6'5\"" },
      { first_name: "Miles", last_name: "Wilson", jersey_number: "22", position: "PF", height: "6'6\"" },
      { first_name: "Tyler", last_name: "Robinson", jersey_number: "33", position: "C", height: "6'8\"" },
    ]
  },
  {
    name: "Cambridge International Academy",
    team_name: "Cambridge International Academy",
    abbreviation: "CIA",
    league: "OSBA",
    division: "West",
    primary_color: "#2F4F4F",
    gradientStart: "#2F4F4F",
    gradientEnd: "#556B2F",
    city: "Cambridge",
    province: "ON",
    wins: 4, losses: 6,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Jaylen", last_name: "Richards", jersey_number: "2", position: "PG", height: "6'1\"" },
      { first_name: "Darnell", last_name: "Smith", jersey_number: "5", position: "SG", height: "6'3\"" },
      { first_name: "Kwame", last_name: "Owusu", jersey_number: "10", position: "SF", height: "6'5\"" },
      { first_name: "Tunde", last_name: "Balogun", jersey_number: "22", position: "PF", height: "6'7\"" },
      { first_name: "Daniel", last_name: "Chukwu", jersey_number: "25", position: "C", height: "6'8\"" },
      { first_name: "Marcus", last_name: "Taylor", jersey_number: "3", position: "PG", height: "6'0\"" },
      { first_name: "Chris", last_name: "Okafor", jersey_number: "14", position: "SG", height: "6'4\"" },
      { first_name: "Nana", last_name: "Mensah", jersey_number: "21", position: "SF", height: "6'5\"" },
      { first_name: "Patrick", last_name: "Amadi", jersey_number: "30", position: "PF", height: "6'6\"" },
      { first_name: "James", last_name: "Okonkwo", jersey_number: "33", position: "C", height: "6'9\"" },
    ]
  },
  {
    name: "Polaris Prep Academy",
    team_name: "Polaris Prep Academy",
    abbreviation: "PPA",
    league: "OSBA",
    division: "East",
    primary_color: "#191970",
    gradientStart: "#191970",
    gradientEnd: "#483D8B",
    city: "Toronto",
    province: "ON",
    wins: 3, losses: 7,
    staff: [{ name: "Staff", title: "Head Coach" }],
    players: [
      { first_name: "Koby", last_name: "Walker", jersey_number: "1", position: "PG", height: "6'0\"" },
      { first_name: "Jayden", last_name: "Clarke", jersey_number: "5", position: "SG", height: "6'3\"" },
      { first_name: "Rasheed", last_name: "Ahmed", jersey_number: "11", position: "SF", height: "6'5\"" },
      { first_name: "Deron", last_name: "Williams", jersey_number: "22", position: "PF", height: "6'6\"" },
      { first_name: "Tyrese", last_name: "Brown", jersey_number: "25", position: "C", height: "6'8\"" },
      { first_name: "Andre", last_name: "Clark", jersey_number: "3", position: "PG", height: "6'1\"" },
      { first_name: "Kaiden", last_name: "Jones", jersey_number: "14", position: "SG", height: "6'4\"" },
      { first_name: "Zion", last_name: "Thomas", jersey_number: "20", position: "SF", height: "6'5\"" },
      { first_name: "Nasir", last_name: "Jackson", jersey_number: "30", position: "PF", height: "6'7\"" },
      { first_name: "DeShawn", last_name: "Harris", jersey_number: "44", position: "C", height: "6'9\"" },
    ]
  },
];

// Live games to seed for testing LiveGame stats entry
const LIVE_GAMES = [
  { home: "Royal Crown School", away: "Ridley College", date: "2026-02-08" },
  { home: "Crestwood Prep", away: "Orangeville Prep", date: "2026-02-08" },
];

// Upcoming scheduled games
const UPCOMING_GAMES = [
  { home: "William Academy", away: "C.O.D.E. Academy", date: "2026-02-10" },
  { home: "Ridley College", away: "Brampton City Prep National", date: "2026-02-11" },
  { home: "Hodan Prep", away: "Inspire Academy", date: "2026-02-12" },
  { home: "Fort Erie International Academy", away: "Cambridge International Academy", date: "2026-02-13" },
  { home: "Royal Crown School", away: "Polaris Prep Academy", date: "2026-02-14" },
  { home: "Crestwood Prep", away: "Lincoln Prep", date: "2026-02-15" },
];

// Recent game results from OSBA Feb 7-8, 2026
const RECENT_GAMES = [
  { home: "Crestwood Prep", away: "Canada Topflight Academy Gold", home_score: 112, away_score: 67, date: "2026-02-07" },
  { home: "C.O.D.E. Academy", away: "Canada Topflight Academy Gold", home_score: 82, away_score: 69, date: "2026-02-07" },
  { home: "Hodan Prep", away: "Lincoln Prep", home_score: 101, away_score: 96, date: "2026-02-07" },
  { home: "Royal Crown School", away: "Hodan Prep", home_score: 90, away_score: 80, date: "2026-01-25" },
  { home: "Crestwood Prep", away: "William Academy", home_score: 102, away_score: 97, date: "2026-01-28" },
  { home: "Ridley College", away: "William Academy", home_score: 89, away_score: 74, date: "2026-02-01" },
  { home: "Royal Crown School", away: "Crestwood Prep", home_score: 89, away_score: 73, date: "2026-01-20" },
  { home: "Ridley College", away: "Lincoln Prep", home_score: 91, away_score: 81, date: "2026-01-30" },
  { home: "Cambridge International Academy", away: "Brampton City Prep National", home_score: 95, away_score: 82, date: "2026-02-05" },
  { home: "Orangeville Prep", away: "Polaris Prep Academy", home_score: 85, away_score: 72, date: "2026-02-03" },
];

export default function SeedOSBA() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState({ step: '', progress: 0, log: [], error: null });
  const [isSeeding, setIsSeeding] = useState(false);

  const addLog = (msg) => setStatus(s => ({ ...s, log: [...s.log, msg] }));

  const seedMutation = useMutation({
    mutationFn: async () => {
      setIsSeeding(true);
      setStatus({ step: 'Starting...', progress: 0, log: [], error: null });
      const teamMap = {};

      // Step 1: Create Teams in bulk
      addLog('Creating 14 OSBA teams...');
      setStatus(s => ({ ...s, step: 'Creating teams...', progress: 10 }));

      const teamRecords = OSBA_TEAMS.map(t => ({
        name: t.name,
        team_name: t.team_name,
        abbreviation: t.abbreviation,
        league: t.league,
        division: t.division,
        primary_color: t.primary_color,
        gradientStart: t.gradientStart,
        gradientEnd: t.gradientEnd,
        city: t.city,
        province: t.province,
        wins: t.wins,
        losses: t.losses,
        ties: 0,
        staff: t.staff,
        status: "active",
      }));

      let createdTeams = [];
      try {
        createdTeams = await base44.entities.Team.bulkCreate(teamRecords);
        createdTeams.forEach((team, i) => {
          teamMap[OSBA_TEAMS[i].name] = team;
        });
        addLog(`Created ${createdTeams.length} teams`);
      } catch (e) {
        addLog(`Bulk team create failed: ${e.message}. Trying one-by-one...`);
        for (const t of OSBA_TEAMS) {
          try {
            const team = await base44.entities.Team.create({
              name: t.name, team_name: t.team_name, abbreviation: t.abbreviation,
              league: t.league, division: t.division, primary_color: t.primary_color,
              wins: t.wins, losses: t.losses, ties: 0, status: "active",
            });
            teamMap[t.name] = team;
            addLog(`Team: ${t.name}`);
          } catch (e2) {
            addLog(`SKIP team ${t.name}: ${e2.message}`);
          }
        }
      }

      setStatus(s => ({ ...s, step: 'Creating players...', progress: 35 }));

      // Step 2: Create Players in bulk per team
      let totalPlayers = 0;
      for (let i = 0; i < OSBA_TEAMS.length; i++) {
        const t = OSBA_TEAMS[i];
        const team = teamMap[t.name];
        if (!team) continue;

        const pct = 35 + Math.round((i / OSBA_TEAMS.length) * 45);
        setStatus(s => ({ ...s, step: `Players: ${t.abbreviation}...`, progress: pct }));

        const playerRecords = t.players.map(p => ({
          name: `${p.first_name} ${p.last_name}`,
          first_name: p.first_name,
          last_name: p.last_name,
          jersey_number: p.jersey_number,
          number: p.jersey_number,
          position: p.position,
          height: p.height,
          team_id: team.id,
          status: "active",
        }));

        try {
          const created = await base44.entities.Player.bulkCreate(playerRecords);
          totalPlayers += created.length;
          addLog(`${t.abbreviation}: ${created.length} players`);
        } catch (e) {
          // Fallback: try minimal fields
          addLog(`Bulk failed for ${t.abbreviation}, trying minimal...`);
          const minRecords = t.players.map(p => ({
            name: `${p.first_name} ${p.last_name}`,
            jersey_number: p.jersey_number,
            position: p.position,
            team_id: team.id,
          }));
          try {
            const created = await base44.entities.Player.bulkCreate(minRecords);
            totalPlayers += created.length;
            addLog(`${t.abbreviation}: ${created.length} players (minimal)`);
          } catch (e2) {
            addLog(`SKIP ${t.abbreviation} players: ${e2.message}`);
          }
        }
      }
      addLog(`Total players created: ${totalPlayers}`);

      // Step 3: Create Games in bulk
      setStatus(s => ({ ...s, step: 'Creating games...', progress: 85 }));

      const gameRecords = RECENT_GAMES
        .filter(g => teamMap[g.home] && teamMap[g.away])
        .map(g => ({
          home_team_id: teamMap[g.home].id,
          away_team_id: teamMap[g.away].id,
          home_team_name: g.home,
          away_team_name: g.away,
          home_team_color: teamMap[g.home].primary_color,
          away_team_color: teamMap[g.away].primary_color,
          home_score: g.home_score,
          away_score: g.away_score,
          quarter: 4,
          game_clock_seconds: 0,
          shot_clock_seconds: 0,
          status: "completed",
          game_date: g.date,
        }));

      try {
        const created = await base44.entities.Game.bulkCreate(gameRecords);
        addLog(`Created ${created.length} games`);
      } catch (e) {
        addLog(`Bulk game create failed: ${e.message}. Trying one-by-one...`);
        for (const rec of gameRecords) {
          try {
            await base44.entities.Game.create(rec);
            addLog(`Game: ${rec.home_team_name} ${rec.home_score}-${rec.away_score} ${rec.away_team_name}`);
          } catch (e2) {
            addLog(`SKIP game: ${e2.message}`);
          }
        }
      }

      // Step 4: Create Live Games with PlayerStat records
      setStatus(s => ({ ...s, step: 'Creating live games...', progress: 90 }));

      const liveGameRecords = LIVE_GAMES
        .filter(g => teamMap[g.home] && teamMap[g.away])
        .map(g => ({
          home_team_id: teamMap[g.home].id,
          away_team_id: teamMap[g.away].id,
          home_team_name: g.home,
          away_team_name: g.away,
          home_team_color: teamMap[g.home].primary_color,
          away_team_color: teamMap[g.away].primary_color,
          home_score: 0,
          away_score: 0,
          quarter: 1,
          game_clock_seconds: 600,
          shot_clock_seconds: 24,
          status: "live",
          game_date: g.date,
        }));

      let liveGamesCreated = [];
      for (const rec of liveGameRecords) {
        try {
          const game = await base44.entities.Game.create(rec);
          liveGamesCreated.push({ game, rec });
          addLog(`Live game: ${rec.home_team_name} vs ${rec.away_team_name}`);
        } catch (e) {
          addLog(`SKIP live game: ${e.message}`);
        }
      }

      // Create PlayerStat records for each live game (required for LiveGame stat tracking)
      for (const { game, rec } of liveGamesCreated) {
        try {
          // Get players for both teams
          const homeTeamData = OSBA_TEAMS.find(t => t.name === rec.home_team_name);
          const awayTeamData = OSBA_TEAMS.find(t => t.name === rec.away_team_name);
          if (!homeTeamData || !awayTeamData) continue;

          // Fetch the created players for these teams from the DB
          const allPlayers = await base44.entities.Player.list('-created_date', 200);
          const homePlayers = allPlayers.filter(p => p.team_id === rec.home_team_id);
          const awayPlayers = allPlayers.filter(p => p.team_id === rec.away_team_id);

          const statRecords = [...homePlayers, ...awayPlayers].map(player => ({
            game_id: game.id,
            player_id: player.id,
            team_id: player.team_id,
            points: 0, fgm: 0, fga: 0, fgm3: 0, fga3: 0,
            ftm: 0, fta: 0, oreb: 0, dreb: 0,
            ast: 0, stl: 0, blk: 0, tov: 0,
            pf: 0, tf: 0, uf: 0, minutes: 0,
          }));

          await base44.entities.PlayerStat.bulkCreate(statRecords);
          addLog(`  Stats: ${statRecords.length} player records for ${rec.home_team_name} vs ${rec.away_team_name}`);
        } catch (e) {
          addLog(`  Stats failed: ${e.message}`);
        }
      }

      // Step 5: Create Upcoming Games
      setStatus(s => ({ ...s, step: 'Creating upcoming games...', progress: 95 }));

      const upcomingGameRecords = UPCOMING_GAMES
        .filter(g => teamMap[g.home] && teamMap[g.away])
        .map(g => ({
          home_team_id: teamMap[g.home].id,
          away_team_id: teamMap[g.away].id,
          home_team_name: g.home,
          away_team_name: g.away,
          home_team_color: teamMap[g.home].primary_color,
          away_team_color: teamMap[g.away].primary_color,
          home_score: 0,
          away_score: 0,
          quarter: 0,
          game_clock_seconds: 0,
          shot_clock_seconds: 0,
          status: "scheduled",
          game_date: g.date,
        }));

      try {
        const created = await base44.entities.Game.bulkCreate(upcomingGameRecords);
        addLog(`Created ${created.length} upcoming games`);
      } catch (e) {
        addLog(`Bulk upcoming failed: ${e.message}. Trying one-by-one...`);
        for (const rec of upcomingGameRecords) {
          try {
            await base44.entities.Game.create(rec);
            addLog(`Upcoming: ${rec.home_team_name} vs ${rec.away_team_name} (${rec.game_date})`);
          } catch (e2) {
            addLog(`SKIP upcoming: ${e2.message}`);
          }
        }
      }

      // Done
      const totalGames = gameRecords.length + liveGamesCreated.length + upcomingGameRecords.length;
      setStatus(s => ({ ...s, step: 'Complete!', progress: 100 }));
      addLog(`Done! ${Object.keys(teamMap).length} teams, ${totalPlayers} players, ${totalGames} games (${gameRecords.length} completed, ${liveGamesCreated.length} live, ${upcomingGameRecords.length} upcoming)`);
      queryClient.invalidateQueries();
    },
    onError: (err) => {
      setStatus(s => ({ ...s, error: err.message }));
      addLog(`ERROR: ${err.message}`);
      setIsSeeding(false);
    },
    onSuccess: () => {
      setIsSeeding(false);
    }
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6 lg:p-8 pb-24">
      <div className="max-w-4xl mx-auto py-4 md:py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">
            OSBA Data Import
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Populate the app with Ontario Scholastic Basketball Association teams, players, and game data
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Card className="bg-white/[0.08] border-white/[0.08]">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-[#c9a962] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{OSBA_TEAMS.length}</div>
              <div className="text-xs text-white/50">Teams</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.08] border-white/[0.08]">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{OSBA_TEAMS.reduce((a, t) => a + t.players.length, 0)}</div>
              <div className="text-xs text-white/50">Players</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.08] border-white/[0.08]">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{RECENT_GAMES.length + LIVE_GAMES.length + UPCOMING_GAMES.length}</div>
              <div className="text-xs text-white/50">Games</div>
            </CardContent>
          </Card>
          <Card className="bg-white/[0.08] border-white/[0.08]">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2025-26</div>
              <div className="text-xs text-white/50">Season</div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Preview */}
        <Card className="bg-white/[0.05] border-white/[0.08] mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">OSBA Men's Division Teams</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OSBA_TEAMS.map(t => (
              <div key={t.abbreviation} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.gradientStart}, ${t.gradientEnd})` }}
                >
                  {t.abbreviation.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white text-sm font-medium truncate">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.division} · {t.wins}-{t.losses} · {t.players.length} players</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Seed Button */}
        <div className="text-center mb-6">
          <Button
            size="lg"
            onClick={() => seedMutation.mutate()}
            disabled={isSeeding}
            className="bg-gradient-to-r from-[#c9a962] to-[#b8943f] hover:from-[#b8943f] hover:to-[#a6832d] text-[#0f0f0f] font-bold text-lg px-12 py-6 rounded-xl min-h-[56px]"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Seeding... {status.progress}%
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Import OSBA Data
              </>
            )}
          </Button>
        </div>

        {/* Progress */}
        {(isSeeding || status.progress === 100) && (
          <Card className="bg-white/[0.05] border-white/[0.08]">
            <CardContent className="p-4">
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>{status.step}</span>
                  <span>{status.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/[0.1] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${status.progress}%`,
                      background: status.progress === 100 ? '#10B981' : '#c9a962'
                    }}
                  />
                </div>
              </div>

              {/* Log */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {status.log.map((msg, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    {msg.startsWith('ERROR') ? (
                      <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                    ) : msg.startsWith('Failed') ? (
                      <AlertCircle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="text-white/70">{msg}</span>
                  </div>
                ))}
              </div>

              {status.error && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {status.error}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
