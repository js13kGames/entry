// actions
const READY = uid();
const BLOCKING = uid();
const PREPARING_ATTACK = uid();
const ATTACKING = uid();
const DISABLED = uid();

// directions
const LEFT = uid();
const RIGHT = uid();

const initLevel3Model = (kongStart, trexStart) => {
  const initialHealth = 100;

  // init kong
  const kong = {
    currentAction: READY,
    location: kongStart,
    direction: RIGHT,
    health: initialHealth,
    initialHealth: initialHealth
  }

  // init trex
  const trex = {
    currentAction: READY,
    location: trexStart,
    direction: LEFT,
    health: initialHealth,
    initialHealth: initialHealth
  }

  return {
    initialKongState: kong,
    initialTrexState: trex,
  };
}