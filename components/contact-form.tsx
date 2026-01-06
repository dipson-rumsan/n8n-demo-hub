"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CalendarClock, User, Building2, UserCheck, Calendar, FileText, CheckCircle2, Loader2, Mail } from "lucide-react"

export function SickLeaveForm() {
  const [employeeName, setEmployeeName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [manager, setManager] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [webhookResponse, setWebhookResponse] = useState("")
  const { toast } = useToast()
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeName.trim() || !email.trim() || !department.trim() || !manager || !startDate || !endDate || !reason.trim()) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" })
      return
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast({ title: "Error", description: "End date cannot be before start date.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const formData = { employeeName, email, department, manager, startDate, endDate, reason, submittedAt: new Date().toISOString() }
      const response = await fetch(
        "https://n8n-webhook.rumsan.net/webhook/sick-leave",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      let message = "Your sick leave request has been submitted and will be reviewed by your manager."
      
      try {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json()
          message = responseData?.message || message
        } else {
          // Response is not JSON, try to read as text
          const textResponse = await response.text()
          if (textResponse && textResponse.trim()) {
            message = textResponse
          }
        }
      } catch (parseError) {
        // Ignore parsing errors, use default message
        console.log("Using default message due to response parsing issue")
      }
      
      setWebhookResponse(message)
      setIsSubmitted(true)
      
      setTimeout(() => {
        setEmployeeName(""); setEmail(""); setDepartment(""); setManager(""); setStartDate(""); setEndDate(""); setReason(""); setIsSubmitted(false); setWebhookResponse("")
      }, 5000)
    } catch (error) {
      console.error("Submission error:", error)
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" })
    } finally { 
      setIsSubmitting(false) 
    }
  }

  if (isSubmitted) {
    return (
      <Card className="bg-white border-slate-200 shadow-2xl max-w-3xl mx-auto min-h-[60vh] flex items-center justify-center p-4 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center ring-4 ring-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Request Submitted Successfully!</h2>
          <p className="text-sm md:text-base text-slate-600 text-center">
            {webhookResponse || "Your sick leave request has been submitted and will be reviewed by your manager."}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Returning to form...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (

    <Card className="bg-white border-slate-200 shadow-2xl max-w-4xl mx-auto mt-4 md:mt-8 p-2 md:p-4 overflow-hidden">
      <CardContent className="w-full">
        <CardHeader className="pb-2 md:pb-4">
          <div className="flex items-center gap-3 mb-1 md:mb-2">
            <div className="h-10 w-10 md:h-10 md:w-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
              <CalendarClock className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-slate-900">Submit Leave Request</CardTitle>
          </div>
          <CardDescription className="text-sm md:text-base text-slate-600">
            Fill in the details below to submit your sick leave request. All fields are required.
          </CardDescription>
        </CardHeader>

        {/* ...form content here... */}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {/* Employee Name */}
          <div className="space-y-2">
            <Label htmlFor="employeeName" className="text-slate-700 flex items-center gap-1 text-xs md:text-sm font-medium">
              <User className="w-3 h-3 md:w-4 md:h-4 text-slate-500" /> Employee Name *
            </Label>
            <Input id="employeeName" type="text" placeholder="Full name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)}
              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 h-9 md:h-10 focus:border-purple-500 focus:ring-purple-500/20" required />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 flex items-center gap-1 text-xs md:text-sm font-medium">
              <Mail className="w-3 h-3 md:w-4 md:h-4 text-slate-500" /> Email *
            </Label>
            <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 h-9 md:h-10 focus:border-purple-500 focus:ring-purple-500/20" required />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department" className="text-slate-700 flex items-center gap-1 text-xs md:text-sm font-medium">
              <Building2 className="w-3 h-3 md:w-4 md:h-4 text-slate-500" /> Department *
            </Label>
            <Input id="department" type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)}
              className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 h-9 md:h-10 focus:border-purple-500 focus:ring-purple-500/20" required />
          </div>

          {/* Manager */}
          <div className="space-y-2">
            <Label htmlFor="manager" className="text-slate-700 flex items-center gap-1 text-xs md:text-sm font-medium">
              <UserCheck className="w-3 h-3 md:w-4 md:h-4 text-slate-500" /> Manager *
            </Label>
            <Select value={manager} onValueChange={setManager} required>
              <SelectTrigger className="w-full bg-white border-slate-300 text-slate-900 h-9 md:h-10 focus:border-purple-500 focus:ring-purple-500/20">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent className="z-100 bg-white border-slate-200">
                <SelectItem value="Raktim Shrestha" className="text-slate-900 hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">Raktim Shrestha</SelectItem>
                <SelectItem value="Manzik Shrestha" className="text-slate-900 hover:bg-slate-100 focus:bg-slate-100 cursor-pointer">Manzik Shrestha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-slate-700 flex items-center gap-1 text-xs md:text-sm font-medium">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-500" /> Start Date *
            </Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={today}
              className="bg-white border-slate-300 text-slate-900 h-9 md:h-10 focus:border-purple-500 focus:ring-purple-500/20" required />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-slate-700 flex items-center gap-1 text-xs md:text-sm font-medium">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-500" /> End Date *
            </Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || today}
              className="bg-white border-slate-300 text-slate-900 h-9 md:h-10 focus:border-purple-500 focus:ring-purple-500/20" required />
          </div>

          {/* Reason (spans two columns) */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label htmlFor="reason" className="text-slate-700 flex items-center gap-1 text-xs md:text-sm font-medium">
              <FileText className="w-3 h-3 md:w-4 md:h-4 text-slate-500" /> Reason *
            </Label>
            <Textarea id="reason" placeholder="Reason..." value={reason} onChange={(e) => setReason(e.target.value)}
              rows={2} className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 resize-none" required />
          </div>

          {/* Submit Button (spans two columns) */}
          <div className="col-span-1 md:col-span-2">
            <Button type="submit" className="w-full h-10 md:h-12 text-sm md:text-lg font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all duration-200 shadow-lg shadow-purple-500/20" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <> <CheckCircle2 className="mr-2 h-4 w-4" /> Submit Request </>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

  )
}

// Sick Leave Form Page Component
export function SickLeaveFormPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-8 text-balance">Employee Sick Leave Request</h1>
        <SickLeaveForm />
      </div>
    </main>
  )
}