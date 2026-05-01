"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { VoiceAgentProps } from "@/hooks/use-voice-agent";
import { useVoiceAgent } from "@/hooks/use-voice-agent";
import { CallControls, MicPermissionModal } from "./call-controls";
import { ConversationPanel, InstructionsPanel } from "./conversation-panel";

export function VoiceAgent({
  title = "Voice Agent",
  description = "Start a voice conversation with our Rumsan AI agent",
}: VoiceAgentProps) {
  const {
    callStatus,
    transcripts,
    isLoading,
    stopCall,
    isHovered,
    setIsHovered,
    showInstructions,
    showMicPermissionModal,
    setShowMicPermissionModal,
    microphoneError,
    scrollAreaRef,
    conversationHistory,
    fontSize,
    showTimestamps,
    compactMode,
    handleStartCall,
    requestMicrophoneAccess,
    handleClear,
  } = useVoiceAgent();

  const isInConversation = conversationHistory.length > 0 && callStatus.isConnected;

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col max-h-[calc(100dvh-80px)] sm:max-h-[calc(100vh-100px)] mt-1 sm:mt-3">
      <Card
        className={`bg-linear-to-br from-white via-blue-50/30 to-purple-50/30 border-2 shadow-xl flex flex-col overflow-hidden rounded-xl mx-1 sm:mx-2 max-h-[calc(100dvh-100px)] sm:max-h-200 transition-all duration-500 ${
          isInConversation
            ? "border-blue-400/60 shadow-blue-500/20 shadow-2xl"
            : "border-blue-100/50 shadow-blue-500/10"
        }`}
      >
        <CardHeader className={`text-center ${isInConversation ? "pb-0 py-1" : "pb-1 py-2"}`}>
          {!isInConversation && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
              <div className="rounded-full bg-linear-to-r from-blue-500 to-purple-600 shadow-lg p-1.5 sm:p-2">
                <Brain className="text-white h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <CardTitle className="font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg sm:text-2xl">
                {title}
              </CardTitle>
            </div>
          )}
          {description && !isInConversation && (
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-xs sm:text-base px-2 sm:px-0">
              {description}
            </p>
          )}
        </CardHeader>

        <CardContent
          className={`flex flex-col overflow-hidden flex-1 ${
            isInConversation
              ? "space-y-0 py-0 px-1 sm:px-2"
              : "space-y-1 py-2 px-3 sm:px-6"
          }`}
        >
          <CallControls
            callStatus={callStatus}
            transcripts={transcripts}
            conversationHistory={conversationHistory}
            isLoading={isLoading}
            isHovered={isHovered}
            microphoneError={microphoneError}
            onStartCall={handleStartCall}
            onStopCall={stopCall}
            onClear={handleClear}
            onHoverEnter={() => setIsHovered(true)}
            onHoverLeave={() => setIsHovered(false)}
          />

          <div
            className={`grid grid-cols-1 lg:grid-cols-3 flex-1 min-h-0 ${
              isInConversation ? "" : "gap-2 sm:gap-3"
            }`}
          >
            {transcripts.length > 0 ? (
              <ConversationPanel
                conversationHistory={conversationHistory}
                scrollAreaRef={scrollAreaRef}
                compactMode={compactMode}
                fontSize={fontSize}
                showTimestamps={showTimestamps}
              />
            ) : (
              showInstructions && !callStatus.isConnected && <InstructionsPanel />
            )}
          </div>
        </CardContent>
      </Card>

      {showMicPermissionModal && (
        <MicPermissionModal
          microphoneError={microphoneError}
          onClose={() => setShowMicPermissionModal(false)}
          onAllow={requestMicrophoneAccess}
        />
      )}
    </div>
  );
}
