'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useVoxLogin, useVoxRegister } from '@/hooks/use-vox-flow'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { User, Mail, Lock, ArrowRight, Zap } from 'lucide-react'

interface AuthModalProps {
  isLoginModalOpen: boolean
  setIsLoginModalOpen: (val: boolean) => void
  setIsAuthenticated: (val: boolean) => void
}

export default function AuthModal({ isLoginModalOpen, setIsLoginModalOpen, setIsAuthenticated }: AuthModalProps) {
  const { toast } = useToast()
  
  const [authMode, setAuthMode] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const loginMut = useVoxLogin()
  const registerMut = useVoxRegister()

  const handleLogin = () => {
    const fd = new FormData()
    fd.append('username', loginEmail)
    fd.append('password', loginPassword)
    loginMut.mutate(fd, {
      onSuccess: (data: any) => {
        document.cookie = `access_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        setIsAuthenticated(true)
        setIsLoginModalOpen(false)
        toast({ title: "Authenticated Successfully" })
      },
      onError: (err: any) => toast({ title: "Login Failed", description: err.message, variant: "destructive" })
    })
  }

  const handleRegister = () => {
    registerMut.mutate({ username: regEmail, password: regPassword }, {
      onSuccess: () => {
        toast({ title: "Registered Successfully from Identity Hook!" })
        setAuthMode('login')
        setLoginEmail(regEmail)
      },
      onError: (err: any) => toast({ title: "Registration Failed", description: err.message, variant: "destructive" })
    })
  }

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogContent className="sm:max-w-106.25 p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="bg-linear-to-br from-blue-700 via-indigo-600 to-violet-800 p-10 text-white relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 blur-2xl">
            <Zap className="w-48 h-48 fill-white" />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="flex items-center gap-4 text-3xl font-extrabold text-white tracking-tight">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                <User className="h-7 w-7 text-white" />
              </div>
              Login / Register
            </DialogTitle>
            <DialogDescription className="text-white/80 mt-4 text-base font-medium leading-relaxed max-w-70">
              Authenticate your session to access the VoxFlow API endpoints.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="px-10 py-8 bg-white">
          <div className="w-full">
            <div className="grid w-full grid-cols-2 mb-8 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
              <button 
                onClick={() => setAuthMode('login')}
                className={`rounded-xl py-2.5 text-sm font-bold transition-all text-center cursor-pointer select-none ${authMode === 'login' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`rounded-xl py-2.5 text-sm font-bold transition-all text-center cursor-pointer select-none ${authMode === 'register' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Register
              </button>
            </div>
            
            {authMode === 'login' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-bold text-slate-800 ml-1">Username / Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                      <Input 
                        placeholder="admin@example.com" 
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)} 
                        className="pl-11 h-13 bg-slate-50/80 border-slate-200/70 focus-visible:ring-blue-500 rounded-2xl transition-all shadow-xs hover:border-slate-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between ml-1">
                      <Label className="text-sm font-bold text-slate-800">Password</Label>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        className="pl-11 h-13 bg-slate-50/80 border-slate-200/70 focus-visible:ring-blue-500 rounded-2xl transition-all shadow-xs hover:border-slate-300"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleLogin} 
                  disabled={loginMut.isPending} 
                  className="w-full h-13 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-bold shadow-xl shadow-blue-200/60 transition-all active:scale-[0.97] group relative overflow-hidden"
                >
                  {loginMut.isPending ? (
                    <span className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center w-full">
                      Login
                      <ArrowRight className="h-5 w-5 opacity-80 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            )}

            {authMode === 'register' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-bold text-slate-800 ml-1">Username / Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-all" />
                      <Input 
                        placeholder="user@example.com" 
                        value={regEmail} 
                        onChange={(e) => setRegEmail(e.target.value)} 
                        className="pl-11 h-13 bg-slate-50/80 border-slate-200/70 focus-visible:ring-indigo-500 rounded-2xl transition-all shadow-xs hover:border-slate-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-bold text-slate-800 ml-1">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-all" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={regPassword} 
                        onChange={(e) => setRegPassword(e.target.value)} 
                        className="pl-11 h-13 bg-slate-50/80 border-slate-200/70 focus-visible:ring-indigo-500 rounded-2xl transition-all shadow-xs hover:border-slate-300"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleRegister} 
                  disabled={registerMut.isPending} 
                  className="w-full h-13 bg-linear-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200/60 transition-all active:scale-[0.97] group relative overflow-hidden"
                >
                  {registerMut.isPending ? (
                    <span className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                      Registering...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center w-full">
                      Register
                      <ArrowRight className="h-5 w-5 opacity-80 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
