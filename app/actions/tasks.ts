'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. დავალების დამატება
export async function addTask(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const title = formData.get('title') as string
  if (!title) return { error: 'Title is required' }

  const { error } = await supabase.from('tasks').insert([
    {
      title,
      user_id: user.id,
    },
  ])

  if (error) return { error: error.message }

  // განვაახლოთ დეშბორდის გვერდი, რომ ახალი დავალება ეგრევე გამოჩნდეს
  revalidatePath('/dashboard')
}

// 2. დავალების წაშლა
export async function deleteTask(taskId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
}

// 3. სტატუსის შეცვლა (completed / pending)
export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const supabase = await createClient()

  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'

  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', taskId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
}