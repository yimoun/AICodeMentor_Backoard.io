// Event classification types
export type EventClassification =
  | "CHEMICAL_SPILL"
  | "INJURY"
  | "ENVIRONMENTAL_INCIDENT"
  | "NEAR_MISS"
  | "FIRST_AID"
  | "FIRE_ALARM"
  | "EQUIPMENT_FAILURE"
  | "PROPERTY_DAMAGE"
  | "LOST_TIME";

// Event interface
export default interface IEvent {
  event_id: number;
  declared_by_id: number;
  description: string;
  start_datetime: string;
  end_datetime: string | null;
  organizational_unit_id: number;
  type: string;
  classification: EventClassification;
}
