var $projects = $('.projects')
let projects

var initProjects = () => {
  projects = {
    // FISHING PROJECTS
    fishing: {
      emoji: '🎣',
      done: false,
      unlocked: true,
      cost: {
        wood: 10,
        food: 10,
        ppl: 4,
        days: 2,
      },
      description: 'Develop fishing tools (+3🍒/day, -1 ready 👤)',
      callback: () => {
        log('Fishing preparations have been developed (+3 food per day).', 'blue', '🎣', 'info')
        show('#fh') // Fishing house
        populationReady -= 1
        populationFishers++
  
        interval(() => {
          startTrail(DAY / 3, 'fishTrail', false)
        }, DAY / 3)
  
        dayEvents.push(() => {
          resources.food += 3
          log(`+3🍒`, 'blue', '🐟', 'tasks')
        })
      }
    },
    high_sea_fishing: {
      emoji: '🚣‍',
      done: false,
      unlocked: true,
      requires: [
        'shipyard',
        'fishing'
      ],
      cost: {
        wood: 25,
        food: 10,
        ppl: 5,
        days: 5
      },
      description: 'Build a fishing boat (+5🍒/day, -1 ready 👤).',
      callback: () => {
        populationReady -= 1
        populationFishers++
        show('#boatTrail')
  
        interval(() => {
          startTrail(DAY / 2, 'boatTrail', false)
        }, DAY / 2)
  
        dayEvents.push(() => {
          resources.food += 5
          log(`+5🍒`, 'blue', '🐟', 'tasks')
        })
      }
    },
    // CONSTRUCTION PROJECTS
    carpentry: {
      emoji: '🔨',
      done: false,
      unlocked: false,
      cost: {
        wood: 10,
        food: 10,
        ppl: 4,
        days: 2,
      },
      description: 'Recycle wood and build better buildings (+5 wood per day)',
      callback: () => {
        log('Carpentry was perfected, new buildings are now available.', 'blue', '🔨', 'info')
        blink('projects', 'blink')
        renderProject('shipyard')
        renderProject('spinning_wheel')
        renderProject('chapel')
        dayEvents.push(() => {
          resources.wood += 5
          blink('wood', 'green')
          log(`+5🌳`, 'blue', '🔨', 'tasks')
        })
      }
    },
    weapons: {
      emoji: '🛡',
      done: false,
      unlocked: false,
      description: 'Produce weapons and armor (-75% chance of animal attack deaths)',
      cost: {
        wood: 50,
        food: 15,
        ppl: 4,
        days: 2,
      },
      callback: () => {
        attackChance = attackChance * 0.25
      }
    },
    spinning_wheel: {
      emoji: '🧶',
      done: false,
      unlocked: true,
      description: 'Some foragers will start gathering fibers, spinning into thread, producing cloth. (-50% food from foraging)',
      cost: {
        wood: 10,
        food: 20,
        ppl: 2,
        days: 3,
      },
      callback: () => {
        log('Foragers have started producing cloth from fibers.', 'blue', '🧶', 'info')
        foragingReturns -= 1
        blink('forage', 'blink')
        unlockCaravela()
      }
    },
    shipyard: {
      emoji: '⚓',
      done: false,
      unlocked: true,
      requires: [
        'carpentry'
      ],
      cost: {
        wood: 100,
        food: 10,
        ppl: 5,
        days: 7
      },
      description: 'Build a shipyard where boats and ships can be built.',
      callback: () => {
        log('The shipyard construction has finished!', 'blue', '⚓', 'info')
        show('#sy')
        renderProject('high_sea_fishing')
        unlockCaravela()
      }
    },
    caravela: {
      description: 'Build a caravela and return home. Requires a shipyard, carpentry, textiles, as well as food for the trip.',
      emoji: '⛵️',
      done: false,
      unlocked: false,
      requires: [
        'shipyard',
        'spinning_wheel',
      ],
      cost: {
        wood: 100,
        food: 200,
        ppl: 10,
        days: 8,
      },
      callback: () => {
        log('The Caravela construction is complete! Shall we?', 'green', '🌊', 'info')
        show('#ship')
        $('#ship').classList.add('new')
        $('#leave').disabled = false
        show('#leave')
      }
    },
    chapel: {
      description: 'A place where people can gather to support, encorage and service each other.',
      requires: ['carpentry'],
      emoji: '🙏',
      cost: {
        wood: 20,
        food: 20,
        ppl: 3,
        days: 3,
      },
      callback: () => {
        godsWrath -= 0.5
        show('#pray')
        show('#cp')
      }
    }
  }
}

var unlockCaravela = () => {
  if (projects.spinning_wheel.done && projects.shipyard.done) {
    log('The caravela construction project is in sight!', 'green', '🌊', 'info')
    projects.caravela.unlocked = true
  }
}

var renderProject = (key) => {
  var project = projects[key]
  var $newProject = $$('div', 'project', null)
  let icon = project.emoji
  if (key === 'caravela') {
    icon = `<svg height="50px" viewBox="0 0 50 50" width="50px">${$('#ss').outerHTML.replace('"ss"', '')}</svg>`
  }
  $newProject.id = key
  $newProject.innerHTML = 
`<div class="icon">${icon}</div>
<div class="title caps">${key.replace(/_/g, ' ')}</div>
<small class="description">${project.description}</small>
<div class="cost">
  ${project.cost.wood} 🌳  ${project.cost.food} 🍒  ${key == 'caravela' ? '1 - 10' : project.cost.ppl} 👥  ${project.cost.days} days ⏳
</div>`

  $projects.append($newProject)
  on($newProject, 'click', selectProject(key))
}

var selectProject = (projectName) => () => {
  if ($projects.classList.contains('closed')) {
    $projects.classList.remove('closed')
    return
  }

  var project = projects[projectName]
  if (project.done) {
    return
  }
  if (projectName === 'caravela' && !project.unlocked) {
    var missing = projects.caravela.requires
      .filter(r => !projects[r].done)
      .map(r => `[${r.replace(/_/g, ' ')}]`)
    if (missing.length > 0) {
      blink(projectName, 'no')
      var msg = `Construction of the new caravela requires ${missing.join(' and ')}.`
      $('#requirements').innerText = msg
      log(msg, null, '❌', 'info')
      return
    }
  }
  
  missing = ['wood', 'food'].filter(
    resource => resources[resource] < project.cost[resource]
  )
  if (missing.length > 0) {
    blink(projectName, 'no')
    var msg = `There is not enough ${missing.join(' and ')} to start the ${projectName} project`
    $('#requirements').innerText = msg
    log(msg, null, '❌', 'info')
    return
  }

  if (!enoughPeople(project.cost.ppl)) {
    if (projectName === 'caravela') {
      var ready = populationReady - populationStarving
      var manHours = project.cost.ppl * project.cost.days
      var duration = Math.ceil(manHours / ready)
      log(`The Caravela contruction started, but with only ${ready} people, it will take ${duration} days.`, null, '⚒', 'info')
      project.cost.ppl = ready
      project.cost.days = duration
    } else {
      var msg = `Not enough people ready to start the ${projectName} project`
      $('#requirements').innerText = msg
      log(msg, null, '❌', 'info')
      return 
    }
  }

  resources.wood -= project.cost.wood
  resources.food -= project.cost.food
  populationReady -= project.cost.ppl
  
  project.done = true
  var $project = $(`.project#${projectName}`)
  var duration = project.cost.days * DAY
  $project.style.transition = `height ${duration}ms linear`
  $project.classList.add('in-progress')
  $projects.classList.add('closed')

  timeout(() => {
    // log(`Project ${projectName.toUpperCase()} has has been completed`, 'blue', project.emoji)
    $project.classList.add('done')
    $project.classList.remove('in-progress')
    $project.style.transition = null
    populationReady += project.cost.ppl

    project.callback()
  }, duration)
}