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
    
    return Math.round(Math.acos((BC*BC+AB*AB-AC*AC) / (2*BC*AB)) * (180 / Math.PI));   
}


/**
 * a====b
 *    c==__d
 * 
 * @param {*} A 
 * @param {*} B 
 * @param {*} C 
 * @param {*} D 
 */
export function findAngle2Vectors(A, B, C, D) {
    var vectorAB = [A[1]-B[1], A[0] - B[0]]
    var vectorCD = [C[1] - D[1], C[0] - D[0]]
    const x1 = vectorAB[0]
    const x2 = vectorAB[1]
    const y1 = vectorCD[0]
    const y2 = vectorCD[1]
      
    return (Math.atan2(x1*y2-y1*x2,x1*x2+y1*y2)* (180 / Math.PI));
}