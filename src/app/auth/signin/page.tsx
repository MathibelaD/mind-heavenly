'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../../../../contexts/SupabaseProvider'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Brain, Heart, Sparkles } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'

const demoAccounts = [
  {
    email: 'therapist@demo.com',
    password: 'Demo123!',
    role: 'Therapist',
    description: 'Access therapist dashboard, manage clients, sessions',
    icon: Brain,
    gradient: 'bg-gradient-therapy'
  },
  {
    email: 'client@demo.com',
    password: 'Demo123!',
    role: 'Individual Client',
    description: 'Personal therapy sessions, AI support, resources',
    icon: Heart,
    gradient: 'bg-gradient-wellness'
  },
  {
    email: 'partner1@demo.com',
    password: 'Demo123!',
    role: 'Couple Partner 1',
    description: 'Couples therapy sessions, shared resources',
    icon: Sparkles,
    gradient: 'bg-gradient-mindful'
  },
  {
    email: 'partner2@demo.com',
    password: 'Demo123!',
    role: 'Couple Partner 2',
    description: 'Couples therapy sessions, partner perspective',
    icon: Sparkles,
    gradient: 'bg-gradient-mindful'
  }
]

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { supabase } = useSupabase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError('Invalid email or password')
        return
      }

      if (data.user) {
        // Get user data to determine role and redirect accordingly
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (userData) {
          const role = userData.role
          switch (role) {
            case 'THERAPIST':
              router.push('/dashboard/therapist')
              break
            case 'CLIENT':
              router.push('/dashboard/client')
              break
            case 'COUPLE_PARTNER_1':
            case 'COUPLE_PARTNER_2':
              router.push('/dashboard/couple')
              break
            default:
              router.push('/dashboard')
          }
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      })

      if (error) {
        setError('Demo login failed')
        return
      }

      if (data.user) {
        // Get user data to determine role and redirect accordingly
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (userData) {
          const role = userData.role
          switch (role) {
            case 'THERAPIST':
              router.push('/dashboard/therapist')
              break
            case 'CLIENT':
              router.push('/dashboard/client')
              break
            case 'COUPLE_PARTNER_1':
            case 'COUPLE_PARTNER_2':
              router.push('/dashboard/couple')
              break
            default:
              router.push('/dashboard')
          }
        }
      }
    } catch (err) {
      setError('Demo login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-wellness-50 to-mindful-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-gradient mb-4"
            >
              Mind Heavenly
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              AI-Powered Therapy Platform for Individuals and Couples
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="backdrop-blur-sm bg-white/90">
                <CardHeader>
                  <CardTitle className="text-2xl font-display">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your account to continue your therapy journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-12 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      variant="therapy"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                  <div className="mt-6 text-sm text-muted-foreground text-center">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-primary underline bg-transparent border-none outline-none cursor-pointer p-0 m-0"
                      onClick={() => router.push('/auth/signup')}
                    >
                      Sign up
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Demo Accounts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-display font-semibold mb-2">Try Demo Accounts</h2>
                <p className="text-muted-foreground">
                  Explore different user experiences with pre-configured demo accounts
                </p>
              </div>

              <div className="grid gap-4">
                {demoAccounts.map((account, index) => {
                  const Icon = account.icon
                  return (
                    <motion.div
                      key={account.email}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Card className="cursor-pointer card-hover backdrop-blur-sm bg-white/90">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`${account.gradient} p-3 rounded-2xl`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{account.role}</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {account.description}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-2 text-xs">
                                <code className="bg-muted px-2 py-1 rounded">
                                  {account.email}
                                </code>
                                <code className="bg-muted px-2 py-1 rounded">
                                  {account.password}
                                </code>
                              </div>
                              <Button
                                onClick={() => handleDemoLogin(account.email, account.password)}
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full sm:w-auto"
                                disabled={isLoading}
                              >
                                {isLoading ? 'Loading...' : 'Try Demo'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center"
          >
            <h3 className="text-2xl font-display font-semibold mb-8">Platform Features</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="bg-gradient-therapy p-4 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold">AI-Powered Support</h4>
                <p className="text-sm text-muted-foreground">
                  24/7 AI assistant with crisis detection and sentiment analysis
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-wellness p-4 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold">Secure Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  HIPAA-compliant video sessions with end-to-end encryption
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-mindful p-4 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold">Personalized Content</h4>
                <p className="text-sm text-muted-foreground">
                  Curated resources, meditations, and therapeutic exercises
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
