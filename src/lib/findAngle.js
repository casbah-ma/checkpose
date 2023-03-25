/**
 * Find angle from 3 points
 * 
 * @param {Array} A 
 * @param {Array} B 
 * @param {Array} C 
 * @returns {String} 
 * @example 
 * 
 * const Angledegree = findAngle([1,2],[5,6], [0,3])
 */
export default function findAngle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B[0]-A[0],2)+ Math.pow(B[1]-A[1],2));    
    var BC = Math.sqrt(Math.pow(B[0]-C[0],2)+ Math.pow(B[1]-C[1],2)); 
    var AC = Math.sqrt(Math.pow(C[0]-A[0],2)+ Math.pow(C[1]-A[1],2));
    
    return Math.round(180-(Math.acos((BC*BC+AB*AB-AC*AC) / (2*BC*AB)) * (180 / Math.PI)));   
}

/**
 * Find angle from 4 points (2 vectors)
 * @param {*} A 
 * @param {*} B 
 * @param {*} C 
 * @param {*} D 
 * @returns 
 */
export function calculateAngle2Vectors(A, B, C, D) {
    // Calculate vector AB
    let vectorAB = [B[0] - A[0], B[1] - A[1]];
    // Calculate vector CD
    let vectorCD = [D[0] - C[0], D[1] - C[1]];
    // Calculate dot product
    let dotProduct = vectorAB[0] * vectorCD[0] + vectorAB[1] * vectorCD[1];
    // Calculate magnitude of vectorAB and vectorCD
    let vectorABMagnitude = Math.sqrt(Math.pow(vectorAB[0], 2) + Math.pow(vectorAB[1], 2));
    let vectorCDMagnitude = Math.sqrt(Math.pow(vectorCD[0], 2) + Math.pow(vectorCD[1], 2));
    // Calculate and return angle
    return Math.round(Math.acos(dotProduct / (vectorABMagnitude * vectorCDMagnitude)) * (180/Math.PI));
  }