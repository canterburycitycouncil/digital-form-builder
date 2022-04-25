import { Page, ConditionRawData } from "@xgovformbuilder/model";

export type Path = Page["path"];
export type ConditionName = ConditionRawData["name"];
export type Found<T> = [T, number];
