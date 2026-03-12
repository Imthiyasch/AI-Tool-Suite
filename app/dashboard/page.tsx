import { redirect } from 'next/navigation'

export default function DashboardPage() {
    // Redirect to the first module by default
    redirect('/dashboard/notes')
}
