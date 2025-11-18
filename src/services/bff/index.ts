/**
 * Backend for Frontend (BFF) Services
 * 
 * The BFF layer acts as an intermediary between the front-end and multiple backend services.
 * It combines multiple API calls into single optimized requests, reducing network overhead
 * and providing data structures that perfectly match the front-end component needs.
 * 
 * Benefits:
 * - Reduced number of HTTP requests
 * - Lower latency (parallel backend calls)
 * - Simplified front-end code
 * - Better error handling
 * - Consistent data structures
 */

export { collaboratorsBFFService } from './collaboratorsBFF';
export { default as bffApiClient } from './bffApi';
