import type { UploadedFile } from "./types";

export const parseEvaluationContent = (content: string) => {
  let decision = "Pending";
  let reasoning = content;

  if (
    content.includes("**Evaluation Result: Accept**") ||
    content.includes("**Final Decision: Accept**")
  ) {
    decision = "Accept";
    reasoning = content
      .replace(/\*\*(?:Evaluation Result|Final Decision): Accept\*\*/, "")
      .trim();
  } else if (
    content.includes("**Evaluation Result: Reject**") ||
    content.includes("**Final Decision: Reject**")
  ) {
    decision = "Reject";
    reasoning = content
      .replace(/\*\*(?:Evaluation Result|Final Decision): Reject\*\*/, "")
      .trim();
  } else {
    const contentLower = content.toLowerCase();

    const rejectIndicators = [
      "does not meet",
      "insufficient experience",
      "lacks significant",
      "not suitable",
      "inadequate",
      "falls short",
      "weak candidate",
      "not qualified",
      "does not qualify",
      "challenging to consider",
      "not recommend",
      "reject",
    ];

    const acceptIndicators = [
      "strong candidate",
      "highly qualified",
      "excellent fit",
      "meets all requirements",
      "exceeds expectations",
      "well-qualified",
      "highly recommended",
      "accept",
      "move forward",
      "proceed with",
    ];

    const rejectCount = rejectIndicators.filter((indicator) =>
      contentLower.includes(indicator)
    ).length;
    const acceptCount = acceptIndicators.filter((indicator) =>
      contentLower.includes(indicator)
    ).length;

    if (rejectCount > acceptCount && rejectCount > 0) {
      decision = "Reject";
    } else if (acceptCount > rejectCount && acceptCount > 0) {
      decision = "Accept";
    }

    const lines = content.split("\n");
    const lastFewLines = lines.slice(-5).join(" ").toLowerCase();
    if (lastFewLines.includes("recommend") && lastFewLines.includes("reject")) {
      decision = "Reject";
    } else if (
      lastFewLines.includes("recommend") &&
      lastFewLines.includes("accept")
    ) {
      decision = "Accept";
    }
  }

  return { decision, reasoning };
};

export const downloadPreviewData = (uploadedFile: UploadedFile) => {
  if (!uploadedFile.parsedData) return;

  const fileName = uploadedFile.file.name.replace(/\.[^/.]+$/, "");
  const data = uploadedFile.parsedData;

  const generatePDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    const addText = (text: string, fontSize = 10, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, contentWidth);

      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize * 0.6;
      });
      yPosition += 3;
    };

    const formatMarkdownForPDF = (content: string): string => {
      return content
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^[-*+]\s+/gm, "• ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    };

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`CV Analysis Report - ${fileName}`, margin, yPosition);
    yPosition += 15;

    if (data.evaluation?.decision) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      if (data.evaluation.decision === "Accept") {
        doc.setTextColor(0, 128, 0);
      } else {
        doc.setTextColor(255, 0, 0);
      }
      doc.text(`Final Decision: ${data.evaluation.decision}`, margin, yPosition);
      yPosition += 10;
      doc.setTextColor(0, 0, 0);
    }

    if (data.evaluation?.evaluationReasons) {
      addText("EVALUATION SUMMARY", 12, true);
      const formattedContent = formatMarkdownForPDF(data.evaluation.evaluationReasons);

      const paragraphs = formattedContent.split("\n\n");
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          if (paragraph.startsWith("•")) {
            addText(paragraph, 10, false);
          } else if (
            paragraph.toLowerCase().includes("strengths") ||
            paragraph.toLowerCase().includes("weaknesses") ||
            paragraph.toLowerCase().includes("recommendation")
          ) {
            addText(paragraph, 11, true);
          } else {
            addText(paragraph, 10, false);
          }
        }
      });
    }

    if (data.personalInfo) {
      addText("PERSONAL INFORMATION", 12, true);
      if (data.personalInfo.name) addText(`Name: ${data.personalInfo.name}`, 10, false);
      if (data.personalInfo.email) addText(`Email: ${data.personalInfo.email}`, 10, false);
      if (data.personalInfo.phone) addText(`Phone: ${data.personalInfo.phone}`, 10, false);
      if (data.personalInfo.location) addText(`Location: ${data.personalInfo.location}`, 10, false);
    }

    if (data.skills && data.skills.length > 0) {
      addText("SKILLS", 12, true);
      data.skills.forEach((skill: string) => {
        addText(`• ${skill}`, 10, false);
      });
    }

    if (data.experience && data.experience.length > 0) {
      addText("WORK EXPERIENCE", 12, true);
      data.experience.forEach((exp: any) => {
        if (exp.position) addText(`Position: ${exp.position}`, 10, true);
        if (exp.company) addText(`Company: ${exp.company}`, 10, false);
        if (exp.duration) addText(`Duration: ${exp.duration}`, 10, false);
        if (exp.description) addText(`Description: ${exp.description}`, 10, false);
        yPosition += 5;
      });
    }

    if (data.education && data.education.length > 0) {
      addText("EDUCATION", 12, true);
      data.education.forEach((edu: any) => {
        if (edu.degree) addText(`Degree: ${edu.degree}`, 10, true);
        if (edu.institution) addText(`Institution: ${edu.institution}`, 10, false);
        if (edu.year) addText(`Year: ${edu.year}`, 10, false);
        yPosition += 5;
      });
    }

    doc.save(`${fileName}_evaluation_report.pdf`);
  };

  generatePDF();
};
