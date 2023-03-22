/**
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
    
    return Math.acos((BC*BC+AB*AB-AC*AC) / (2*BC*AB)) * (180 / Math.PI);   
}