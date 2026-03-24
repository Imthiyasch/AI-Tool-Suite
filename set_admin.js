// Run: node --env-file=.env.local set_admin.js
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function setAdmin() {
    const email = 'imthiranu@gmail.com';

    // Find the user
    const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) { console.error('Error listing users:', listErr.message); return; }
    
    const user = users.find(u => u.email === email);
    if (!user) { console.error('User not found:', email); return; }

    console.log('Found user:', user.id, user.email);

    // Set is_admin: true in user_metadata
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, is_admin: true }
    });

    if (error) { console.error('Failed:', error.message); return; }
    console.log('✅ Success! imthiranu@gmail.com is now an admin.');
}

setAdmin();
