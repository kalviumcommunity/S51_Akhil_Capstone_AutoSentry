import { useState } from "react";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import "./GoogleCalender.css";

const GoogleCalendar = () => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <></>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
      console.log(starst);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
        body: JSON.stringify(event),
      }
    )
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        alert("Event created, check your Google Calendar!");
      });
  }

  console.log(session);
  return (
<div className="App">
  <div className="container">
    {session ?
      <>
        <h2>Hey there {session.user.email}</h2>
        <p>Start of your event</p>
        <DateTimePicker onChange={setStart} value={start} />
        <p>End of your event</p>
        <DateTimePicker onChange={setEnd} value={end} />
        <p>Event name</p>
        <input type="text" onChange={(e) => setEventName(e.target.value)} />
        <p>Event description</p>
        <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
        <div className="btn-container">
          <button onClick={() => createCalendarEvent()} className="btn-create-event">Create Calendar Event</button>
          <button onClick={() => signOut()} className="btn-sign-out">Sign Out</button>
        </div>
      </>
      :
      <>
        <button onClick={() => googleSignIn()} className="btn-sign-in">Sign In With Google</button>
      </>
    }
  </div>
</div>

);
};

export default GoogleCalendar;
