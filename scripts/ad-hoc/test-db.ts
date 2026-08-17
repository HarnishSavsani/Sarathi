import { getDbInstance } from "../../src/lib/db/core";

try {
  console.log("Initializing DB instance...");
  const db = getDbInstance();
  console.log("DB instance initialized successfully.");
  const res = db.prepare("SELECT sqlite_version() as version").get() as any;
  console.log("SQLite Version:", res.version);
  
  console.log("Running getProviderMetrics check...");
  const { getProviderMetrics } = await import("../../src/lib/db/callLogStats");
  const metrics = getProviderMetrics();
  console.log("getProviderMetrics returned", metrics.length, "rows");
} catch (error) {
  console.error("Operation failed with error:", error);
}
