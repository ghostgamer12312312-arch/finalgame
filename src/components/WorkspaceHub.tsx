import React, { useState, useEffect } from 'react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  WORKSPACE_SCOPES,
} from '../lib/firebase';
import {
  listDriveFiles,
  uploadGameBackupToDrive,
  deleteDriveFile,
  listCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  listTasks,
  createTask,
  toggleTaskStatus,
  deleteTask,
  createGoogleForm,
  listRecentForms,
  DriveFileItem,
  CalendarEventItem,
  TaskItem,
} from '../lib/workspace';
import {
  Cloud,
  Calendar,
  CheckSquare,
  FileText,
  LogIn,
  LogOut,
  RefreshCw,
  AlertTriangle,
  Upload,
  Trash2,
  ExternalLink,
  Plus,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-red-950/50">
        <div className="flex items-center gap-3 text-red-400 mb-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <h3 className="font-heading font-bold text-lg text-slate-100">{title}</h3>
        </div>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceHub() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'drive' | 'calendar' | 'tasks' | 'forms'>('drive');

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Calendar state
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('Dragon Ball World Tournament Raid');
  const [newEventDesc, setNewEventDesc] = useState('Assemble Z-Fighters to defeat Omega Shenron and earn Omni Tokens');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Forms state
  const [forms, setForms] = useState<DriveFileItem[]>([]);
  const [formsLoading, setFormsLoading] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('Z-Fighter Clan Recruitment & Tournament Poll');
  const [createdFormUrl, setCreatedFormUrl] = useState<string | null>(null);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: async () => {},
  });

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch section data once token is available
  useEffect(() => {
    if (!token) return;
    if (activeSection === 'drive') loadDrive();
    if (activeSection === 'calendar') loadCalendar();
    if (activeSection === 'tasks') loadTasks();
    if (activeSection === 'forms') loadForms();
  }, [token, activeSection]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to authenticate with Google Workspace.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setDriveFiles([]);
    setEvents([]);
    setTasks([]);
    setForms([]);
  };

  // Drive functions
  const loadDrive = async () => {
    if (!token) return;
    setDriveLoading(true);
    setError(null);
    try {
      const files = await listDriveFiles(token);
      setDriveFiles(files);
    } catch (err: any) {
      setError(err.message || 'Error listing Google Drive files.');
    } finally {
      setDriveLoading(false);
    }
  };

  const handleBackupSave = async () => {
    if (!token) return;
    setDriveLoading(true);
    setUploadStatus(null);
    try {
      // Gather local RPG state
      const backupPayload = {
        exportedAt: new Date().toISOString(),
        game: 'Dragon Battle RPG Multiverse',
        player: {
          name: 'Warrior_Goku',
          powerLevel: 850000000,
          zenithTokens: 12500,
          dragonBalls: 7,
          zenkaiLevel: 14,
          ultraInstinctTier: 'Mastered',
        },
        clan: {
          name: 'Saiyan Pride Empire',
          rank: 'Supreme Overlord',
          territories: ['Earth', 'Namek', 'Beerus Planet', 'Null Realm'],
        },
        battlePass: {
          tier: 28,
          isPremium: true,
          seasonalExp: 9400,
        },
      };

      const result = await uploadGameBackupToDrive(token, backupPayload);
      setUploadStatus(`Save backup created in Google Drive: ${result.name}`);
      await loadDrive();
    } catch (err: any) {
      setError(err.message || 'Failed to backup save to Google Drive.');
    } finally {
      setDriveLoading(false);
    }
  };

  const promptDeleteDriveFile = (file: DriveFileItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Google Drive File?',
      message: `Are you sure you want to permanently delete "${file.name}" from your Google Drive? This action cannot be undone.`,
      action: async () => {
        if (!token) return;
        try {
          await deleteDriveFile(token, file.id);
          await loadDrive();
        } catch (err: any) {
          setError(err.message || 'Failed to delete file.');
        }
      },
    });
  };

  // Calendar functions
  const loadCalendar = async () => {
    if (!token) return;
    setCalendarLoading(true);
    setError(null);
    try {
      const items = await listCalendarEvents(token);
      setEvents(items);
    } catch (err: any) {
      setError(err.message || 'Error loading Google Calendar events.');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setCalendarLoading(true);
    setError(null);
    try {
      const start = new Date(eventDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
      await createCalendarEvent(
        token,
        newEventTitle,
        newEventDesc,
        start.toISOString(),
        end.toISOString()
      );
      await loadCalendar();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule calendar raid event.');
    } finally {
      setCalendarLoading(false);
    }
  };

  const promptDeleteEvent = (event: CalendarEventItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Calendar Event?',
      message: `Are you sure you want to remove "${event.summary}" from your Google Calendar?`,
      action: async () => {
        if (!token) return;
        try {
          await deleteCalendarEvent(token, event.id);
          await loadCalendar();
        } catch (err: any) {
          setError(err.message || 'Failed to delete calendar event.');
        }
      },
    });
  };

  // Tasks functions
  const loadTasks = async () => {
    if (!token) return;
    setTasksLoading(true);
    setError(null);
    try {
      const taskList = await listTasks(token);
      setTasks(taskList);
    } catch (err: any) {
      setError(err.message || 'Error loading Google Tasks.');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleSyncDailyQuests = async () => {
    if (!token) return;
    setTasksLoading(true);
    setError(null);
    try {
      const dailyQuests = [
        { title: 'Dragon RPG: Complete 3 Combat Arena Battles', notes: 'Earn +250 EXP and 500 Zeni' },
        { title: 'Dragon RPG: Summon Shenron Wish', notes: 'Collect 7 Dragon Balls and make a wish' },
        { title: 'Dragon RPG: Advance Battle Pass Tier', notes: 'Claim Free & Premium Rewards' },
      ];

      for (const q of dailyQuests) {
        await createTask(token, q.title, q.notes);
      }
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to sync daily quests to Google Tasks.');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newTaskTitle.trim()) return;
    setTasksLoading(true);
    try {
      await createTask(token, newTaskTitle.trim(), 'Added from Dragon Battle RPG Hub');
      setNewTaskTitle('');
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to add task.');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleToggleTask = async (task: TaskItem) => {
    if (!token) return;
    try {
      await toggleTaskStatus(token, task.id, task.status);
      await loadTasks();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle task.');
    }
  };

  const promptDeleteTask = (task: TaskItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Google Task?',
      message: `Are you sure you want to remove "${task.title}" from your Google Tasks checklist?`,
      action: async () => {
        if (!token) return;
        try {
          await deleteTask(token, task.id);
          await loadTasks();
        } catch (err: any) {
          setError(err.message || 'Failed to delete task.');
        }
      },
    });
  };

  // Forms functions
  const loadForms = async () => {
    if (!token) return;
    setFormsLoading(true);
    setError(null);
    try {
      const formsList = await listRecentForms(token);
      setForms(formsList);
    } catch (err: any) {
      setError(err.message || 'Error listing Google Forms.');
    } finally {
      setFormsLoading(false);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newFormTitle.trim()) return;
    setFormsLoading(true);
    setCreatedFormUrl(null);
    setError(null);
    try {
      const newForm = await createGoogleForm(
        token,
        newFormTitle.trim(),
        'Dragon Battle RPG - Player Recruitment, Raid Readiness, and Tournament Feedback'
      );
      if (newForm.responderUri) {
        setCreatedFormUrl(newForm.responderUri);
      }
      await loadForms();
    } catch (err: any) {
      setError(err.message || 'Failed to create Google Form.');
    } finally {
      setFormsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Account Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Cloud className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-black font-heading tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-sky-300 to-amber-200">
                  Google Workspace Command Center
                </h1>
                <p className="text-xs text-slate-400">
                  Capsule Corp Cloud Sync • Google Drive • Calendar • Tasks • Forms
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Connect your Google Workspace account with permission to store game backups on Google Drive,
              schedule Boss Raids on Google Calendar, sync quests with Google Tasks, and create Clan Polls with Google Forms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-heading text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>Sign in with Google</span>
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-700/60 px-4 py-2.5 rounded-xl">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-9 h-9 rounded-full border border-indigo-400"
                  />
                )}
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{user.displayName || 'Authenticated Player'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  </div>
                  <div className="text-[11px] text-slate-400">{user.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {!user ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold font-heading text-slate-200 mb-2">
            Authorization Required
          </h2>
          <p className="text-slate-400 text-xs max-w-md mx-auto mb-6">
            Sign in with Google using the button above to access Google Drive cloud saves, schedule World Tournament reminders on your Calendar, manage daily quests in Google Tasks, and create Clan forms.
          </p>
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            Connect Google Account
          </button>
        </div>
      ) : (
        <>
          {/* Navigation Pill Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'drive', label: 'Google Drive Saves', icon: Cloud },
              { id: 'calendar', label: 'Tournament Calendar', icon: Calendar },
              { id: 'tasks', label: 'Kai Quest Tasks', icon: CheckSquare },
              { id: 'forms', label: 'Clan Forms & Polls', icon: FileText },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-heading transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section: Google Drive */}
          {activeSection === 'drive' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                <div>
                  <h2 className="text-sm font-bold font-heading text-slate-200 flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <span>Capsule Corp Cloud Vault</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Backup your active Dragon RPG warrior roster, inventory, and stats to your personal Google Drive.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadDrive}
                    disabled={driveLoading}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                    title="Refresh Files"
                  >
                    <RefreshCw className={`w-4 h-4 ${driveLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleBackupSave}
                    disabled={driveLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Export Save to Drive</span>
                  </button>
                </div>
              </div>

              {uploadStatus && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{uploadStatus}</span>
                </div>
              )}

              {/* Files Table */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider grid grid-cols-12 gap-4">
                  <span className="col-span-6">File Name</span>
                  <span className="col-span-3">Modified</span>
                  <span className="col-span-3 text-right">Actions</span>
                </div>
                {driveFiles.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    {driveLoading ? 'Loading Google Drive files...' : 'No files found in Google Drive.'}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/60">
                    {driveFiles.map(file => (
                      <div
                        key={file.id}
                        className="px-4 py-3 text-xs grid grid-cols-12 gap-4 items-center hover:bg-slate-800/30 transition"
                      >
                        <div className="col-span-6 flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-sky-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-200 truncate">{file.name}</span>
                        </div>
                        <div className="col-span-3 text-[11px] text-slate-400">
                          {file.modifiedTime
                            ? new Date(file.modifiedTime).toLocaleDateString()
                            : 'Unknown'}
                        </div>
                        <div className="col-span-3 flex items-center justify-end gap-2">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-sky-400 transition"
                              title="Open in Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => promptDeleteDriveFile(file)}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition cursor-pointer"
                            title="Delete File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Calendar */}
          {activeSection === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Creation Form */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl h-fit">
                <h3 className="text-sm font-bold font-heading text-slate-200 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Schedule World Tournament Event</span>
                </h3>
                <form onSubmit={handleCreateEvent} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Event Title</label>
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={e => setNewEventTitle(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Description / Intel</label>
                    <textarea
                      rows={2}
                      value={newEventDesc}
                      onChange={e => setNewEventDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={calendarLoading}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Google Calendar</span>
                  </button>
                </form>
              </div>

              {/* Event List */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-heading text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Upcoming Calendar Schedule</span>
                  </h3>
                  <button
                    onClick={loadCalendar}
                    disabled={calendarLoading}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${calendarLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {events.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    {calendarLoading ? 'Loading schedule...' : 'No upcoming calendar events found.'}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {events.map(ev => {
                      const startTime = ev.start.dateTime
                        ? new Date(ev.start.dateTime).toLocaleString()
                        : ev.start.date || 'All Day';

                      return (
                        <div
                          key={ev.id}
                          className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:border-amber-500/30 transition"
                        >
                          <div>
                            <div className="font-bold text-xs text-slate-200">{ev.summary}</div>
                            {ev.description && (
                              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {ev.description}
                              </div>
                            )}
                            <div className="text-[10px] text-amber-400/90 font-mono mt-1">
                              {startTime}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {ev.htmlLink && (
                              <a
                                href={ev.htmlLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-slate-400 hover:text-amber-400 transition"
                                title="Open in Calendar"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => promptDeleteEvent(ev)}
                              className="p-1.5 text-slate-400 hover:text-red-400 transition cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Tasks */}
          {activeSection === 'tasks' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task Actions */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl h-fit space-y-4">
                <div>
                  <h3 className="text-sm font-bold font-heading text-slate-200 mb-1 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Kai Quest Board</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sync your Dragon RPG daily objectives directly to your real Google Tasks app.
                  </p>
                </div>

                <button
                  onClick={handleSyncDailyQuests}
                  disabled={tasksLoading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sync Daily RPG Quests</span>
                </button>

                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-bold text-slate-300 mb-2">Add Custom Quest</h4>
                  <form onSubmit={handleAddTask} className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. Master Kaioken x20..."
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      disabled={tasksLoading || !newTaskTitle.trim()}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                    >
                      Add Task
                    </button>
                  </form>
                </div>
              </div>

              {/* Tasks List */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-heading text-slate-200 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Your Google Tasks ({tasks.length})</span>
                  </h3>
                  <button
                    onClick={loadTasks}
                    disabled={tasksLoading}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${tasksLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    {tasksLoading ? 'Loading tasks...' : 'No active tasks found in Google Tasks.'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map(task => {
                      const isCompleted = task.status === 'completed';
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                            isCompleted
                              ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                              : 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleToggleTask(task)}
                              className="w-4 h-4 accent-emerald-500 cursor-pointer"
                            />
                            <div>
                              <div
                                className={`text-xs font-semibold ${
                                  isCompleted ? 'line-through text-slate-500' : 'text-slate-200'
                                }`}
                              >
                                {task.title}
                              </div>
                              {task.notes && (
                                <div className="text-[11px] text-slate-400 line-clamp-1">
                                  {task.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => promptDeleteTask(task)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Forms */}
          {activeSection === 'forms' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Generator */}
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl h-fit space-y-4">
                <div>
                  <h3 className="text-sm font-bold font-heading text-slate-200 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Generate Clan Survey</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Create a live Google Form to collect clan recruitment applications, player power level tiers, and raid feedback.
                  </p>
                </div>

                <form onSubmit={handleCreateForm} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Form Title</label>
                    <input
                      type="text"
                      value={newFormTitle}
                      onChange={e => setNewFormTitle(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formsLoading || !newFormTitle.trim()}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Live Google Form</span>
                  </button>
                </form>

                {createdFormUrl && (
                  <div className="p-3 bg-purple-950/60 border border-purple-500/40 rounded-xl space-y-1">
                    <div className="text-[11px] font-bold text-purple-300">Form Published!</div>
                    <a
                      href={createdFormUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-purple-400 underline hover:text-purple-300 flex items-center gap-1"
                    >
                      <span>Open Responder URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Recent Forms List */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-heading text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Your Google Forms</span>
                  </h3>
                  <button
                    onClick={loadForms}
                    disabled={formsLoading}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${formsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {forms.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    {formsLoading ? 'Searching for forms...' : 'No Google Forms found yet.'}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {forms.map(form => (
                      <div
                        key={form.id}
                        className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-purple-500/30 transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-slate-200">{form.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {form.modifiedTime
                                ? `Modified: ${new Date(form.modifiedTime).toLocaleDateString()}`
                                : 'Google Forms Document'}
                            </div>
                          </div>
                        </div>
                        {form.webViewLink && (
                          <a
                            href={form.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold transition"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal for Destructive Operations */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={async () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          await confirmModal.action();
        }}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
