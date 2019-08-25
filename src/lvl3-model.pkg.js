const initLevel3Model = (mapWidth, kongStart, trexStart) => {

  // actions
  const READY = uid();
  const BLOCKING = uid();
  const PREPARING_ATTACK = uid();
  const ATTACKING = uid();
  const DISABLED = uid();

  // directions
  const LEFT = uid();
  const RIGHT = uid();

  // make map data
  const mapData = {
    width: mapWidth
  }

  // init kong
  const kong = {
    currentAction: READY,
    location: kongStart,
    direction: RIGHT,
    health: 100
  }

  // init trex
  const trex = {
    currentAction: READY,
    location: trexStart,
    direction: LEFT,
    health: 100
  }

  return {
    mapData,
    initialKongState: kong,
    initialTrexState: trex,
    actions: {
      READY,
      BLOCKING,
      PREPARING_ATTACK,
      ATTACKING,
      DISABLED
    },
    directions: {
      LEFT,
      RIGHT
    }
  };
}