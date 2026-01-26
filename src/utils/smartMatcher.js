// src/utils/smartMatcher.js

// A simple "AI" algorithm using keyword overlap and fuzzy scoring
export function calculateMatchScore(tripDestination, orderLocation) {
    if (!tripDestination || !orderLocation) return 0;

    const trip = tripDestination.toLowerCase();
    const order = orderLocation.toLowerCase();

    // 1. Direct Match (100%)
    if (trip === order) return 1.0;

    // 2. Partial Match (e.g. "Airport" in "Mumbai Airport")
    if (trip.includes(order) || order.includes(trip)) return 0.8;

    // 3. Token Match (e.g. "Hostel 4" matches "Hostel 4 Canteen")
    const tripTokens = trip.split(' ');
    const orderTokens = order.split(' ');
    const intersection = tripTokens.filter(t => orderTokens.includes(t));

    return intersection.length / Math.max(tripTokens.length, orderTokens.length);
}

// Returns matching orders for a specific trip
export function findMatchingOrders(trip, allOrders) {
    if (!allOrders) return [];
    return allOrders.filter(order => {
        // Only match if order is Open and location matches trip destination
        const score = calculateMatchScore(trip.destination, order.location);
        return score > 0.4 && order.status === 'Open'; // 40% confidence threshold
    });
}