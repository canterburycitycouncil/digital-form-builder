import atob from "atob";
import { FeedbackContextInfo } from "runner/src/server/plugins/engine/feedback/FeedbackContextInfo";

export function decodeFeedbackContextInfo(
  encoded: string | Buffer | undefined | null
): FeedbackContextInfo | void {
  if (encoded) {
    const decoded = JSON.parse(atob(encoded));

    return new FeedbackContextInfo(
      decoded.formTitle,
      decoded.pageTitle,
      decoded.url
    );
  }
}
