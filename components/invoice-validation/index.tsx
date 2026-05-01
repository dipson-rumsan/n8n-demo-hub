"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useClaimsPortal } from "@/hooks/use-claims-portal";
import { StepsSidebar, WarrantyExpiredDialog, WarrantyAvailableDialog, InvalidInvoiceDialog } from "./steps-sidebar";
import { StepStart, StepUpload } from "./step-upload";
import { StepProduct, StepIssue } from "./step-product";
import { StepResolution, SubmissionSuccess } from "./step-resolution";

export function ClaimsPortal() {
  const {
    claimData,
    setClaimData,
    isSubmitting,
    isSubmitted,
    redirectCountdown,
    currentStep,
    setCurrentStep,
    claimStarted,
    warrantyStatus,
    showWarrantyExpiredDialog,
    showWarrantyAvailableDialog,
    showInvalidInvoiceDialog,
    webhookProducts,
    fileInputRef,
    canGoBack,
    currentIssueOptions,
    currentResolutionOptions,
    handleStartClaim,
    handleFileUpload,
    handleProductToggle,
    handleIssueTypeChange,
    handleContinueToProducts,
    handleContinueToIssue,
    handleContinueToResolution,
    handleSubmitClaim,
    handleWarrantyAvailableDecision,
    handleWarrantyExpiredDecision,
    handleInvalidInvoiceDismiss,
  } = useClaimsPortal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      <div className="lg:col-span-1">
        <StepsSidebar
          claimData={claimData}
          warrantyStatus={warrantyStatus}
          claimStarted={claimStarted}
        />
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pt-4 pb-1">
            <CardTitle className="text-base">Claim Support</CardTitle>
            <p className="text-sm text-slate-600">Complete each step to submit your claim</p>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {!isSubmitted ? (
              <>
                {currentStep === 0 && (
                  <StepStart isSubmitting={isSubmitting} onStart={handleStartClaim} />
                )}

                {currentStep === 1 && (
                  <StepUpload
                    invoice={claimData.invoice}
                    isSubmitting={isSubmitting}
                    showAnyDialog={
                      showWarrantyExpiredDialog ||
                      showWarrantyAvailableDialog ||
                      showInvalidInvoiceDialog
                    }
                    fileInputRef={fileInputRef}
                    onFileChange={handleFileUpload}
                    onContinue={handleContinueToProducts}
                  />
                )}

                {showWarrantyExpiredDialog && (
                  <>
                    <div className="border-t border-slate-100 mt-1" />
                    <WarrantyExpiredDialog onDecision={handleWarrantyExpiredDecision} />
                  </>
                )}

                {showWarrantyAvailableDialog && (
                  <>
                    <div className="border-t border-slate-100 mt-1" />
                    <WarrantyAvailableDialog onDecision={handleWarrantyAvailableDecision} />
                  </>
                )}

                {showInvalidInvoiceDialog && (
                  <>
                    <div className="border-t border-slate-100 mt-1" />
                    <InvalidInvoiceDialog onDismiss={handleInvalidInvoiceDismiss} />
                  </>
                )}

                {currentStep === 2 && (
                  <StepProduct
                    selectedProducts={claimData.products}
                    selectedSupportType={claimData.supportType}
                    webhookProducts={webhookProducts}
                    isSubmitting={isSubmitting}
                    onProductToggle={handleProductToggle}
                    onSupportTypeChange={(supportType) =>
                      setClaimData((prev) => ({ ...prev, supportType }))
                    }
                    onContinue={handleContinueToIssue}
                  />
                )}

                {currentStep === 3 && (
                  <StepIssue
                    issueType={claimData.issueType}
                    issueDescription={claimData.issueDescription}
                    issueOptions={currentIssueOptions}
                    isSubmitting={isSubmitting}
                    onIssueTypeChange={handleIssueTypeChange}
                    onIssueDescriptionChange={(value) =>
                      setClaimData((prev) => ({ ...prev, issueDescription: value }))
                    }
                    onContinue={handleContinueToResolution}
                  />
                )}

                {currentStep === 4 && (
                  <StepResolution
                    selectedResolution={claimData.selectedResolution}
                    desiredResolution={claimData.desiredResolution}
                    notificationEmail={claimData.notificationEmail}
                    resolutionOptions={currentResolutionOptions}
                    isSubmitting={isSubmitting}
                    onResolutionChange={(value) =>
                      setClaimData((prev) => ({ ...prev, selectedResolution: value }))
                    }
                    onDesiredResolutionChange={(value) =>
                      setClaimData((prev) => ({ ...prev, desiredResolution: value }))
                    }
                    onEmailChange={(value) =>
                      setClaimData((prev) => ({ ...prev, notificationEmail: value }))
                    }
                    onSubmit={handleSubmitClaim}
                  />
                )}

                {currentStep > 0 && !isSubmitted && canGoBack && (
                  <div className="flex justify-start items-center p-2 bg-white rounded-lg border border-slate-200 mt-2">
                    <Button
                      onClick={() => setCurrentStep((s) => s - 1)}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <SubmissionSuccess
                notificationEmail={claimData.notificationEmail}
                redirectCountdown={redirectCountdown}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-3">
        {/* Results section — reserved for future use */}
      </div>
    </div>
  );
}
