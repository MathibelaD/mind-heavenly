import { config } from 'dotenv'
config()
import { createClient } from '@supabase/supabase-js'
import { Database } from '../lib/database.types'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function main() {
  console.log('🌱 Seeding Supabase database...')

  try {
    // Create demo therapist
    const { data: therapistAuth, error: therapistAuthError } = await supabase.auth.admin.createUser({
      email: 'therapist@demo.com',
      password: 'Demo123!',
      email_confirm: true
    })

    if (therapistAuthError) {
      console.error('Error creating therapist auth:', therapistAuthError)
      return
    }

    const { error: therapistError } = await supabase
      .from('users')
      .insert({
        id: therapistAuth.user.id,
        email: 'therapist@demo.com',
        role: 'THERAPIST',
        is_demo: true,
        first_name: 'Dr. Sarah',
        last_name: 'Johnson',
        name: 'Dr. Sarah Johnson',
        phone: '+1-555-0123',
        timezone: 'America/New_York',
        bio: 'Licensed clinical psychologist with 10+ years of experience in individual and couples therapy.',
        is_active: true
      })

    if (therapistError) {
      console.error('Error creating therapist user:', therapistError)
      return
    }

    // Create therapist profile
    const { error: therapistProfileError } = await supabase
      .from('therapist_profiles')
      .insert({
        user_id: therapistAuth.user.id,
        license_number: 'PSY12345',
        specialty: ['Cognitive Behavioral Therapy', 'Couples Therapy', 'Anxiety Disorders'],
        years_experience: 12,
        education: 'PhD Clinical Psychology - Stanford University',
        certifications: ['Licensed Clinical Psychologist', 'Certified Gottman Therapist'],
        languages: ['English', 'Spanish'],
        hourly_rate: 150.00,
        is_verified: true,
        is_accepting_clients: true,
        practice_address: '123 Therapy Lane, Mental Health City, CA 90210',
        practice_phone: '+1-555-0123',
        available_hours: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '15:00' },
          saturday: { start: '10:00', end: '14:00' },
          sunday: { closed: true }
        }
      })

    if (therapistProfileError) {
      console.error('Error creating therapist profile:', therapistProfileError)
      return
    }

    // Create demo individual client
    const { data: clientAuth, error: clientAuthError } = await supabase.auth.admin.createUser({
      email: 'client@demo.com',
      password: 'Demo123!',
      email_confirm: true
    })

    if (clientAuthError) {
      console.error('Error creating client auth:', clientAuthError)
      return
    }

    const { error: clientError } = await supabase
      .from('users')
      .insert({
        id: clientAuth.user.id,
        email: 'client@demo.com',
        role: 'CLIENT',
        is_demo: true,
        first_name: 'Alex',
        last_name: 'Morgan',
        name: 'Alex Morgan',
        phone: '+1-555-0456',
        timezone: 'America/New_York',
        bio: 'Looking to work through anxiety and improve work-life balance.',
        therapy_goals: 'Manage anxiety, improve confidence, develop better coping strategies',
        emergency_contact: 'Emergency Contact: Jordan Morgan (Sibling) - +1-555-0789',
        is_active: true
      })

    if (clientError) {
      console.error('Error creating client user:', clientError)
      return
    }

    // Create demo couple - Partner 1
    const { data: partner1Auth, error: partner1AuthError } = await supabase.auth.admin.createUser({
      email: 'partner1@demo.com',
      password: 'Demo123!',
      email_confirm: true
    })

    if (partner1AuthError) {
      console.error('Error creating partner1 auth:', partner1AuthError)
      return
    }

    const { error: partner1Error } = await supabase
      .from('users')
      .insert({
        id: partner1Auth.user.id,
        email: 'partner1@demo.com',
        role: 'COUPLE_PARTNER_1',
        is_demo: true,
        first_name: 'Jamie',
        last_name: 'Chen',
        name: 'Jamie Chen',
        phone: '+1-555-0321',
        timezone: 'America/Los_Angeles',
        bio: 'Partner in a relationship seeking couples therapy.',
        therapy_goals: 'Improve communication, resolve conflicts, strengthen relationship',
        emergency_contact: 'Emergency Contact: Sam Chen (Parent) - +1-555-0654',
        is_active: true
      })

    if (partner1Error) {
      console.error('Error creating partner1 user:', partner1Error)
      return
    }

    // Create demo couple - Partner 2
    const { data: partner2Auth, error: partner2AuthError } = await supabase.auth.admin.createUser({
      email: 'partner2@demo.com',
      password: 'Demo123!',
      email_confirm: true
    })

    if (partner2AuthError) {
      console.error('Error creating partner2 auth:', partner2AuthError)
      return
    }

    const { error: partner2Error } = await supabase
      .from('users')
      .insert({
        id: partner2Auth.user.id,
        email: 'partner2@demo.com',
        role: 'COUPLE_PARTNER_2',
        is_demo: true,
        first_name: 'Taylor',
        last_name: 'Rivera',
        name: 'Taylor Rivera',
        phone: '+1-555-0987',
        timezone: 'America/Los_Angeles',
        bio: 'Partner in a relationship seeking couples therapy.',
        therapy_goals: 'Better understanding, emotional intimacy, future planning together',
        emergency_contact: 'Emergency Contact: Maria Rivera (Mother) - +1-555-0432',
        is_active: true
      })

    if (partner2Error) {
      console.error('Error creating partner2 user:', partner2Error)
      return
    }

    // Create the couple relationship
    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .insert({
        partner1_id: partner1Auth.user.id,
        partner2_id: partner2Auth.user.id,
        relationship_start: '2020-03-15',
        therapy_goals: 'Improve communication patterns, resolve recurring conflicts about finances and future planning, strengthen emotional intimacy'
      })
      .select()
      .single()

    if (coupleError) {
      console.error('Error creating couple:', coupleError)
      return
    }

    // Update partners with couple relationship
    await supabase
      .from('users')
      .update({ couple_id: couple.id })
      .eq('id', partner1Auth.user.id)

    await supabase
      .from('users')
      .update({ couple_partner_id: couple.id })
      .eq('id', partner2Auth.user.id)

    // Create content categories
    const categories = [
      {
        name: 'Anxiety Management',
        description: 'Resources for managing anxiety and stress',
        icon: 'brain',
        color: '#3B82F6'
      },
      {
        name: 'Relationship Health',
        description: 'Tools and insights for healthy relationships',
        icon: 'heart',
        color: '#EF4444'
      },
      {
        name: 'Mindfulness & Meditation',
        description: 'Mindfulness exercises and guided meditations',
        icon: 'flower',
        color: '#10B981'
      }
    ]

    const { data: createdCategories, error: categoriesError } = await supabase
      .from('content_categories')
      .insert(categories)
      .select()

    if (categoriesError) {
      console.error('Error creating categories:', categoriesError)
      return
    }

    // Create sample content
    const content = [
      {
        title: '5-Minute Breathing Exercise',
        description: 'A quick breathing exercise to reduce anxiety and stress',
        content: 'Find a comfortable position and focus on your breath. Inhale for 4 counts, hold for 4, exhale for 6. Repeat for 5 minutes.',
        type: 'meditation',
        category_id: createdCategories[0].id,
        tags: ['breathing', 'quick', 'anxiety'],
        target_audience: ['individual', 'couple'],
        difficulty_level: 'beginner',
        author: 'Dr. Sarah Johnson',
        is_published: true,
        duration: 300,
        views: 1542
      },
      {
        title: 'Effective Communication Techniques',
        description: 'Learn how to communicate more effectively with your partner',
        content: 'Effective communication involves active listening, using "I" statements, and avoiding defensive responses...',
        type: 'article',
        category_id: createdCategories[1].id,
        tags: ['communication', 'couples', 'conflict resolution'],
        target_audience: ['couple'],
        difficulty_level: 'intermediate',
        author: 'Dr. Sarah Johnson',
        is_published: true,
        views: 892
      },
      {
        title: 'Progressive Muscle Relaxation',
        description: 'Full body relaxation technique for stress relief',
        content: 'Progressive muscle relaxation involves tensing and releasing different muscle groups to achieve deep relaxation...',
        type: 'meditation',
        category_id: createdCategories[2].id,
        tags: ['relaxation', 'stress relief', 'body awareness'],
        target_audience: ['individual', 'couple'],
        difficulty_level: 'beginner',
        author: 'Dr. Sarah Johnson',
        is_published: true,
        duration: 1200,
        views: 756
      }
    ]

    const { error: contentError } = await supabase
      .from('content')
      .insert(content)

    if (contentError) {
      console.error('Error creating content:', contentError)
      return
    }

    // Create some sample therapy sessions
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7) // Next week

    const sessions = [
      {
        title: 'Individual Therapy Session',
        description: 'Working on anxiety management and coping strategies',
        type: 'INDIVIDUAL' as const,
        start_time: futureDate.toISOString(),
        end_time: new Date(futureDate.getTime() + 50 * 60 * 1000).toISOString(), // 50 minutes later
        client_id: clientAuth.user.id,
        therapist_id: therapistAuth.user.id,
        cost: 150.00,
        status: 'SCHEDULED' as const
      },
      {
        title: 'Couples Therapy Session',
        description: 'Communication patterns and conflict resolution',
        type: 'COUPLE' as const,
        start_time: new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days later
        end_time: new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 60 minutes later
        client_id: partner1Auth.user.id,
        therapist_id: therapistAuth.user.id,
        partner_id: partner2Auth.user.id,
        couple_id: couple.id,
        cost: 200.00,
        status: 'SCHEDULED' as const
      }
    ]

    const { error: sessionsError } = await supabase
      .from('therapy_sessions')
      .insert(sessions)

    if (sessionsError) {
      console.error('Error creating sessions:', sessionsError)
      return
    }

    console.log('✅ Database seeded successfully!')
    console.log('Demo accounts created:')
    console.log('- Therapist: therapist@demo.com / Demo123!')
    console.log('- Individual Client: client@demo.com / Demo123!')
    console.log('- Couple Partner 1: partner1@demo.com / Demo123!')
    console.log('- Couple Partner 2: partner2@demo.com / Demo123!')

  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
