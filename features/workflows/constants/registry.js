import { LaunchBrowserTask } from "@/features/workflows/utils/task/launch-browser";
import { PageToHtmlTask } from "@/features/workflows/utils/task/page-to-html";
import { ExtractTextFromElementTask } from "@/features/workflows/utils/task/extract-text-from-element";
import { FillInputTask } from "@/features/workflows/utils/task/fill-input";
import { ClickElementTask } from "@/features/workflows/utils/task/click-element";
import { WaitForElementTask } from "@/features/workflows/utils/task/wait-for-element";
import { DeliverViaWebhookTask } from "@/features/workflows/utils/task/deliver-via-webhook";
import { ExtractDataWithAITask } from "@/features/workflows/utils/task/extract-data-with-ai";
import { ReadPropertyFromJsonTask } from "@/features/workflows/utils/task/read-property-from-json";
import { AddPropertyToJsonTask } from "@/features/workflows/utils/task/add-property-to-json";
import { NavigateUrlTask } from "@/features/workflows/utils/task/navigate-url-task";
import { ScrollToElementTask } from "@/features/workflows/utils/task/scroll-to-element";

export const TASK_REGISTRY = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask,
};

import { LaunchBrowserExecutor } from "@/features/workflows/utils/executor/launch-browser-executor";
import { PageToHtmlExecutor } from "@/features/workflows/utils/executor/page-to-html-executor";
import { ExtractTextFromElementExecutor } from "@/features/workflows/utils/executor/extract-text-from-element-executor";
import { FillInputExecutor } from "@/features/workflows/utils/executor/fill-input-executor";
import { ClickElementExecutor } from "@/features/workflows/utils/executor/click-element-executor";
import { WaitForElementExecutor } from "@/features/workflows/utils/executor/wait-for-element-executor";
import { DeliverViaWebhookExecutor } from "@/features/workflows/utils/executor/deliver-via-webhook-executor";
import { ExtractDataWithAiExecutor } from "@/features/workflows/utils/executor/extract-data-with-ai-executor";
import { ReadPropertyFromJsonExecutor } from "@/features/workflows/utils/executor/read-property-from-json-executor";
import { AddPropertyToJsonExecutor } from "@/features/workflows/utils/executor/add-property-to-json-executor";
import { NavigateUrlExecutor } from "@/features/workflows/utils/executor/navigate-url-executor";
import { ScrollToElementExecutor } from "@/features/workflows/utils/executor/scroll-to-element-executor";

export const EXECUTOR_REGISTRY = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_EMELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,
};
