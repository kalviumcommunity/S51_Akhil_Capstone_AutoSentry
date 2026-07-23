import { useState } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import { toast } from 'react-toastify';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './GoogleCalender.css';
import { FaGoogle, FaCalendarPlus, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';

const GoogleCalendar = () => {
  const [searchParams]  = useSearchParams();
  const taskParam       = searchParams.get('task');
  const dateParam       = searchParams.get('date');

  const parsedDate  = dateParam ? new Date(dateParam) : null;
  const initialStart = parsedDate && !isNaN(parsedDate) ? parsedDate : new Date();

  const [start, setStart]                   = useState(initialStart);
  const [end, setEnd]                       = useState(new Date());
  const [eventName, setEventName]           = useState(taskParam || '');
  const [eventDescription, setEventDescription] = useState('');
  const [creating, setCreating]             = useState(false);

  const session     = useSession();
  const supabase    = useSupabaseClient();
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return (
      <div className="gc-loading">
        <div className="gc-spinner" />
        <p>Connecting…</p>
      </div>
    );
  }

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { scopes: 'https://www.googleapis.com/auth/calendar' },
    });
    if (error) toast.error('Failed to connect Google account');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out of Google');
  };

  const createEvent = async () => {
    if (!eventName.trim()) { toast.error('Please enter an event name'); return; }
    if (end <= start)      { toast.error('End time must be after start time'); return; }

    setCreating(true);
    const event = {
      summary:     eventName,
      description: eventDescription,
      start: { dateTime: start.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      end:   { dateTime: end.toISOString(),   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    };

    try {
      const res  = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + session.provider_token },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error('Calendar API error');
      toast.success('Event created! Check your Google Calendar.');
      setEventName('');
      setEventDescription('');
    } catch {
      toast.error('Failed to create event. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="gc-page">

      {/* ── HEADER ── */}
      <div className="gc-header">
        <div className="gc-header-bg" aria-hidden="true" />
        <div className="gc-container gc-header-inner">
          <div>
            <span className="gc-eyebrow">Maintenance Scheduling</span>
            <h1 className="gc-title">Google Calendar</h1>
            <p className="gc-subtitle">
              Sync your maintenance tasks directly to your Google Calendar.
            </p>
          </div>
          <NavLink to="/garage" className="gc-back-btn">← Back to Garage</NavLink>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="gc-body">
        <div className="gc-container">
          {!session ? (

            /* ── NOT CONNECTED ── */
            <div className="gc-connect-card">
              <div className="gc-connect-icon">
                <FaCalendarAlt />
              </div>
              <h2>Connect Google Calendar</h2>
              <p>
                Sign in with your Google account to create maintenance events
                directly in your calendar. Your Auto Sentry tasks will be
                pre-filled automatically.
              </p>
              <button className="gc-google-btn" onClick={googleSignIn}>
                <FaGoogle /> Sign in with Google
              </button>
              <div className="gc-connect-features">
                {[
                  'Events sync directly to your primary calendar',
                  'Task name and date are pre-filled from your garage',
                  'Set custom start and end times',
                ].map(f => (
                  <div className="gc-feature-row" key={f}>
                    <span className="gc-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

          ) : (

            /* ── CONNECTED ── */
            <div className="gc-form-wrap">
              <div className="gc-session-bar">
                <div className="gc-session-info">
                  <div className="gc-session-dot" />
                  <span>Connected as <strong>{session.user.email}</strong></span>
                </div>
                <button className="gc-signout-btn" onClick={signOut}>
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>

              <div className="gc-form-card">
                <div className="gc-form-card-header">
                  <FaCalendarPlus className="gc-form-icon" />
                  <h2>Create Calendar Event</h2>
                </div>

                <div className="gc-form">
                  <div className="gc-field">
                    <label htmlFor="gc-name">Event Name</label>
                    <input
                      id="gc-name"
                      type="text"
                      placeholder="e.g. Oil Change — Toyota Camry"
                      value={eventName}
                      onChange={e => setEventName(e.target.value)}
                    />
                  </div>

                  <div className="gc-field">
                    <label htmlFor="gc-desc">Description (optional)</label>
                    <input
                      id="gc-desc"
                      type="text"
                      placeholder="Add any notes about this service…"
                      value={eventDescription}
                      onChange={e => setEventDescription(e.target.value)}
                    />
                  </div>

                  <div className="gc-datetime-row">
                    <div className="gc-field">
                      <label>Start Time</label>
                      <div className="gc-picker-wrap">
                        <DateTimePicker onChange={setStart} value={start} className="gc-picker" />
                      </div>
                    </div>
                    <div className="gc-field">
                      <label>End Time</label>
                      <div className="gc-picker-wrap">
                        <DateTimePicker onChange={setEnd} value={end} className="gc-picker" />
                      </div>
                    </div>
                  </div>

                  <button
                    className="gc-create-btn"
                    onClick={createEvent}
                    disabled={creating}
                  >
                    {creating ? 'Creating…' : <><FaCalendarPlus /> Create Event</>}
                  </button>
                </div>
              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleCalendar;
