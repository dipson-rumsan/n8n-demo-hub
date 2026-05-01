"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Phone, PhoneOff, Trash2, Volume2 } from "lucide-react";
import { CallStatus } from "@/hooks/use-retell-voice";
import { ConversationMessage } from "@/hooks/use-voice-agent";

interface Props {
  callStatus: CallStatus;
  transcripts: any[];
  conversationHistory: ConversationMessage[];
  isLoading: boolean;
  isHovered: boolean;
  microphoneError: string | null;
  onStartCall: () => void;
  onStopCall: () => void;
  onClear: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}

export function CallControls({
  callStatus,
  transcripts,
  conversationHistory,
  isLoading,
  isHovered,
  microphoneError,
  onStartCall,
  onStopCall,
  onClear,
  onHoverEnter,
  onHoverLeave,
}: Props) {
  const isInConversation = conversationHistory.length > 0 && callStatus.isConnected;

  return (
    <>
      {/* Status Badge */}
      {!isInConversation && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-1">
          <Badge
            variant={callStatus.isConnected ? "default" : "secondary"}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium transition-all duration-300 ${
              callStatus.isConnected
                ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25 animate-pulse"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {callStatus.isConnected ? (
              <>
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <Phone className="h-4 w-4" />
                Connected & Active
              </>
            ) : (
              <>
                <PhoneOff className="h-4 w-4" />
                Ready to Connect
              </>
            )}
          </Badge>
        </div>
      )}

      {/* Error Display */}
      {(callStatus.error || microphoneError) && (
        <div className="p-1.5 bg-linear-to-r from-red-50 to-pink-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-1 text-red-700">
            <div className="w-0.5 h-0.5 bg-red-500 rounded-full"></div>
            <p className="font-medium text-xs">
              {microphoneError
                ? `Microphone: ${microphoneError}`
                : `Error: ${callStatus.error}`}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`flex flex-row gap-2 justify-center items-center flex-wrap ${
          isInConversation ? "justify-end mb-1 sm:mb-2" : ""
        }`}
      >
        {callStatus.isAgentSpeaking && isInConversation && (
          <Badge className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/30 mr-2 sm:mr-3 rounded-full border border-purple-300/30">
            <div className="relative">
              <Volume2 className="h-3 w-3 animate-bounce text-white" />
              <div className="absolute inset-0 h-3 w-3 bg-white/20 rounded-full animate-ping"></div>
            </div>
            <span className="text-white">AI Speaking</span>
          </Badge>
        )}
        <Button
          onClick={callStatus.isConnected ? onStopCall : onStartCall}
          disabled={isLoading}
          variant={callStatus.isConnected ? "destructive" : "default"}
          className={`flex items-center gap-1.5 transition-all duration-300 transform hover:scale-105 ${
            isInConversation
              ? "px-3 py-1 text-xs rounded-md shadow-md"
              : "px-5 py-2 text-sm rounded-lg"
          } ${
            callStatus.isConnected
              ? "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 font-medium text-white"
              : "bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 text-white font-semibold"
          }`}
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
        >
          {callStatus.isConnected ? (
            <>
              <PhoneOff
                className={`h-4 w-4 transition-transform duration-300 ${
                  isHovered ? "scale-110" : ""
                }`}
              />
              End Call
            </>
          ) : (
            <>
              <Phone
                className={`h-4 w-4 transition-transform duration-300 ${
                  isHovered ? "scale-110" : ""
                }`}
              />
              {isLoading ? "Connecting..." : "Start Call"}
            </>
          )}
        </Button>

        {transcripts.length > 0 && !isInConversation && (
          <Button
            onClick={onClear}
            variant="outline"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all duration-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------

interface MicModalProps {
  microphoneError: string | null;
  onClose: () => void;
  onAllow: () => void;
}

export function MicPermissionModal({ microphoneError, onClose, onAllow }: MicModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md relative bg-white border-slate-200 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-3 sm:p-4 rounded-full bg-linear-to-r from-blue-500 to-purple-600 shadow-lg">
              <Mic className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
            Microphone Access Required
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <p className="text-gray-600 leading-relaxed">
              To have a voice conversation with our AI assistant, we need access to your microphone.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium">Your voice data stays private and secure</p>
              </div>
            </div>
          </div>

          {microphoneError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{microphoneError}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-900 bg-white hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={onAllow}
              className="flex-1 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              Allow Microphone
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
