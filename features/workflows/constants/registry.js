import { ManuallyRunConfig } from "@/features/workflows/components/configs/manually-run-config";
import { RandomNumberConfig } from "@/features/workflows/components/configs/random-number-config";
import { UpdateRecordConfig } from "@/features/workflows/components/configs/update-record-config";

export const CONFIG_REGISTRY = {
  MANUALLY_RUN: ManuallyRunConfig,
  RANDOM_NUMBER: RandomNumberConfig,
  UPDATE_RECORD: UpdateRecordConfig,
};

import { ManuallyRunExecutor } from "@/features/workflows/utils/executor/manually-run-executor";
import { RandomNumberExecutor } from "@/features/workflows/utils/executor/random-number-executor";
import { UpdateRecordExecutor } from "@/features/workflows/utils/executor/update-record-executor";

export const EXECUTOR_REGISTRY = {
  MANUALLY_RUN: ManuallyRunExecutor,
  RANDOM_NUMBER: RandomNumberExecutor,
  UPDATE_RECORD: UpdateRecordExecutor,
};

import { ManuallyRunTask } from "@/features/workflows/utils/task/manually-run";
import { RandomNumberTask } from "@/features/workflows/utils/task/random-number";
import { UpdateRecordTask } from "@/features/workflows/utils/task/update-record";

export const TASK_REGISTRY = {
  MANUALLY_RUN: ManuallyRunTask,
  RANDOM_NUMBER: RandomNumberTask,
  UPDATE_RECORD: UpdateRecordTask,
};
