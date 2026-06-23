const gestureMap: Record<string, string> = {
  'explaining': 'gesture_explaining',
  'nodding': 'gesture_nod',
  'concerned': 'expression_concerned',
  'listening': 'idle_listening',
  'happy': 'expression_happy',
  'neutral': 'idle_neutral',
};

export const getAnimationName = (gesture: string) => {
  return gestureMap[gesture] || gestureMap['neutral'];
};