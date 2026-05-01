"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle, AlertCircle, XCircle, Search } from "lucide-react"

interface Ticket {
  id: string
  title: string
  category: string
  priority: string
  status: "submitted" | "under_review" | "needs_correction" | "approved" | "rejected"
  submittedAt: string
  lastUpdated: string
  feedback?: string
  corrections?: string[]
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "Login Issue with Mobile App",
    category: "technical",
    priority: "high",
    status: "needs_correction",
    submittedAt: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-15T14:20:00Z",
    feedback: "Please provide more details about the device model and OS version.",
    corrections: ["Add device specifications", "Include error screenshots"],
  },
  {
    id: "TKT-002",
    title: "Feature Request: Dark Mode",
    category: "feature",
    priority: "medium",
    status: "approved",
    submittedAt: "2024-01-14T09:15:00Z",
    lastUpdated: "2024-01-15T11:45:00Z",
    feedback: "Great suggestion! This has been added to our development roadmap.",
  },
  {
    id: "TKT-003",
    title: "Billing Discrepancy",
    category: "billing",
    priority: "urgent",
    status: "under_review",
    submittedAt: "2024-01-15T16:00:00Z",
    lastUpdated: "2024-01-15T16:00:00Z",
  },
]

const getStatusIcon = (status: Ticket["status"]) => {
  switch (status) {
    case "submitted":
      return <Clock className="h-4 w-4" />
    case "under_review":
      return <AlertCircle className="h-4 w-4" />
    case "needs_correction":
      return <XCircle className="h-4 w-4" />
    case "approved":
      return <CheckCircle className="h-4 w-4" />
    case "rejected":
      return <XCircle className="h-4 w-4" />
  }
}

const getStatusColor = (status: Ticket["status"]) => {
  switch (status) {
    case "submitted":
      return "default"
    case "under_review":
      return "secondary"
    case "needs_correction":
      return "destructive"
    case "approved":
      return "default"
    case "rejected":
      return "destructive"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "urgent":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function TicketStatusDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch tickets
    const fetchTickets = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      setTimeout(() => {
        setTickets(mockTickets)
        setIsLoading(false)
      }, 1000)
    }

    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Tickets</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by ticket ID or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No tickets found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <CardDescription>Ticket ID: {ticket.id}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority.toUpperCase()}</Badge>
                    <Badge variant={getStatusColor(ticket.status)} className="flex items-center space-x-1">
                      {getStatusIcon(ticket.status)}
                      <span>{ticket.status.replace("_", " ").toUpperCase()}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span> {ticket.category}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span> {new Date(ticket.submittedAt).toLocaleDateString()}
                  </div>
                </div>

                {ticket.feedback && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Review Feedback:</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{ticket.feedback}</p>
                    </div>
                  </>
                )}

                {ticket.corrections && ticket.corrections.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Required Corrections:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {ticket.corrections.map((correction, index) => (
                        <li key={index}>{correction}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {ticket.status === "needs_correction" && (
                  <Button variant="outline" className="w-full bg-transparent">
                    Resubmit with Corrections
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
