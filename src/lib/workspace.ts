// Google Workspace APIs Service: Drive, Calendar, Tasks, and Forms

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
}

export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  updated?: string;
}

export interface TaskListItem {
  id: string;
  title: string;
}

export interface GoogleFormItem {
  formId: string;
  info: {
    title: string;
    description?: string;
    documentTitle?: string;
  };
  responderUri?: string;
}

// ---------------- Google Drive APIs ----------------
export async function listDriveFiles(accessToken: string): Promise<DriveFileItem[]> {
  const query = encodeURIComponent("trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)&pageSize=25&orderBy=modifiedTime desc`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Drive list failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
}

export async function uploadGameBackupToDrive(
  accessToken: string,
  backupData: Record<string, any>,
  filename = `DragonRPG_Save_${new Date().toISOString().split('T')[0]}.json`
): Promise<DriveFileItem> {
  const metadata = {
    name: filename,
    mimeType: 'application/json',
    description: 'Dragon Battle RPG Save Backup and Multiverse Profile',
  };

  const fileContent = JSON.stringify(backupData, null, 2);
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to backup save to Drive: ${res.statusText}`);
  }

  return await res.json();
}

export async function downloadDriveFile(accessToken: string, fileId: string): Promise<any> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download file from Google Drive: ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteDriveFile(accessToken: string, fileId: string): Promise<boolean> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete Drive file: ${res.statusText}`);
  }

  return true;
}

// ---------------- Google Calendar APIs ----------------
export async function listCalendarEvents(accessToken: string): Promise<CalendarEventItem[]> {
  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    now
  )}&maxResults=15&singleEvents=true&orderBy=startTime`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Calendar list failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.items || [];
}

export async function createCalendarEvent(
  accessToken: string,
  summary: string,
  description: string,
  startDateTime: string,
  endDateTime: string
): Promise<CalendarEventItem> {
  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  const body = {
    summary,
    description,
    start: { dateTime: startDateTime },
    end: { dateTime: endDateTime },
    colorId: '5', // Yellow/Gold Dragon Ball theme
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Calendar event: ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteCalendarEvent(accessToken: string, eventId: string): Promise<boolean> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete Calendar event: ${res.statusText}`);
  }

  return true;
}

// ---------------- Google Tasks APIs ----------------
export async function listTaskLists(accessToken: string): Promise<TaskListItem[]> {
  const url = 'https://tasks.googleapis.com/tasks/v1/users/@me/lists?maxResults=10';
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Tasks list failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.items || [];
}

export async function listTasks(accessToken: string, tasklistId = '@default'): Promise<TaskItem[]> {
  const url = `https://tasks.googleapis.com/tasks/v1/lists/${tasklistId}/tasks?showCompleted=true&showHidden=true&maxResults=30`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google Tasks fetch failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.items || [];
}

export async function createTask(
  accessToken: string,
  title: string,
  notes?: string,
  tasklistId = '@default',
  due?: string
): Promise<TaskItem> {
  const url = `https://tasks.googleapis.com/tasks/v1/lists/${tasklistId}/tasks`;
  const body: Record<string, any> = {
    title,
    notes,
    status: 'needsAction',
  };
  if (due) body.due = due;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create task: ${res.statusText}`);
  }

  return await res.json();
}

export async function toggleTaskStatus(
  accessToken: string,
  taskId: string,
  currentStatus: 'needsAction' | 'completed',
  tasklistId = '@default'
): Promise<TaskItem> {
  const newStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';
  const url = `https://tasks.googleapis.com/tasks/v1/lists/${tasklistId}/tasks/${taskId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to update task status: ${res.statusText}`);
  }

  return await res.json();
}

export async function deleteTask(
  accessToken: string,
  taskId: string,
  tasklistId = '@default'
): Promise<boolean> {
  const url = `https://tasks.googleapis.com/tasks/v1/lists/${tasklistId}/tasks/${taskId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete task: ${res.statusText}`);
  }

  return true;
}

// ---------------- Google Forms APIs ----------------
export async function createGoogleForm(
  accessToken: string,
  title: string,
  description?: string
): Promise<GoogleFormItem> {
  const url = 'https://forms.googleapis.com/v1/forms';
  const body = {
    info: {
      title,
      documentTitle: title,
      description: description || 'Dragon Battle RPG Clan & Tournament Evaluation Form',
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Form: ${res.statusText}`);
  }

  const formData = await res.json();

  // Add sample questions to the form (Clan Name, Power Level, Favorite Z-Fighter)
  try {
    const batchUpdateUrl = `https://forms.googleapis.com/v1/forms/${formData.formId}:batchUpdate`;
    const batchBody = {
      requests: [
        {
          createItem: {
            item: {
              title: "What is your Saiyan / Warrior Name?",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: { paragraph: false },
                },
              },
            },
            location: { index: 0 },
          },
        },
        {
          createItem: {
            item: {
              title: "What is your Current Power Level tier?",
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: 'RADIO',
                    options: [
                      { value: 'Mortal (Under 100,000)' },
                      { value: 'Super Saiyan (1,000,000 - 10,000,000)' },
                      { value: 'God / Ultra Instinct (100,000,000+)' },
                      { value: 'Omni King Transcendence' },
                    ],
                  },
                },
              },
            },
            location: { index: 1 },
          },
        },
        {
          createItem: {
            item: {
              title: "Clan Strategy and Tournament Readiness feedback",
              questionItem: {
                question: {
                  required: false,
                  textQuestion: { paragraph: true },
                },
              },
            },
            location: { index: 2 },
          },
        },
      ],
    };

    await fetch(batchUpdateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchBody),
    });
  } catch (addQuestionsError) {
    console.warn('Form created but batch questions failed:', addQuestionsError);
  }

  return formData;
}

export async function listRecentForms(accessToken: string): Promise<DriveFileItem[]> {
  // Forms are listed via Drive API with specific mimeType
  const query = encodeURIComponent("mimeType = 'application/vnd.google-apps.form' and trashed = false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,modifiedTime,webViewLink)&pageSize=10&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch Google Forms: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
}
