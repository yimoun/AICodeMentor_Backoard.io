import type IEvent from "../../data_interfaces/IEvent";
import type { EventClassification } from "../../data_interfaces/IEvent";

const classifications: EventClassification[] = [
  "CHEMICAL_SPILL",
  "INJURY",
  "ENVIRONMENTAL_INCIDENT",
  "NEAR_MISS",
  "FIRST_AID",
  "FIRE_ALARM",
  "EQUIPMENT_FAILURE",
  "PROPERTY_DAMAGE",
  "LOST_TIME",
];

export const MOCK_EVENTS: IEvent[] = Array.from({ length: 30 }, (_, i) => {
  const id = i + 1;
  const daysAgo = Math.floor(Math.random() * 30); // up to 30 days ago
  const hoursOffset = Math.floor(Math.random() * 24);
  const start = new Date(Date.now() - (daysAgo * 24 + hoursOffset) * 3600 * 1000);
  const ended = Math.random() > 0.6 ? new Date(start.getTime() + (Math.floor(Math.random() * 6) + 1) * 3600 * 1000) : null;

  return {
    event_id: id,
    declared_by_id: (id % 5) + 1,
    description: `Événement simulé #${id} — description courte pour test.`,
    start_datetime: start.toISOString(),
    end_datetime: ended ? ended.toISOString() : null,
    organizational_unit_id: ((id % 3) + 1),
    type: ["EHS", "ENVIRONMENT", "SAFETY"][id % 3],
    classification: classifications[id % classifications.length],
  } as IEvent;
});

export default MOCK_EVENTS;