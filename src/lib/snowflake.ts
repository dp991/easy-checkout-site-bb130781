// Simple snowflake-like ID generator for slugs
let sequence = 0;
let lastTimestamp = -1;

export function generateSnowflakeId(): string {
  let timestamp = Date.now();
  
  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) & 0xfff;
    if (sequence === 0) {
      // Wait for next millisecond
      while (timestamp <= lastTimestamp) {
        timestamp = Date.now();
      }
    }
  } else {
    sequence = 0;
  }
  
  lastTimestamp = timestamp;
  
  // Generate a base36 string from timestamp + sequence
  const id = ((timestamp - 1609459200000) * 0x1000 + sequence).toString(36);
  return id;
}
