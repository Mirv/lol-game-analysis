import React from 'react'
import scaleLinear from 'simple-linear-scale'

const SUMMONERS_RIFT_DOMAIN = {
  min: {x: -120, y: -120},
  max: {x: 14870, y: 14980}
}
const MINIMAP_SIZE = { width: 512, height: 512 }

let xScale = scaleLinear([SUMMONERS_RIFT_DOMAIN.min.x, SUMMONERS_RIFT_DOMAIN.max.x], [0, MINIMAP_SIZE.width])
let yScale = scaleLinear([SUMMONERS_RIFT_DOMAIN.min.y, SUMMONERS_RIFT_DOMAIN.max.y], [MINIMAP_SIZE.height, 0])

function Minimap (props) {
  let { data } = props

  return (
    <div className='minimap'>
      <svg width={MINIMAP_SIZE.width} height={MINIMAP_SIZE.height}>
        <image
          xlinkHref='/img/minimap.png'
          x={0}
          y={0}
          width={MINIMAP_SIZE.width}
          height={MINIMAP_SIZE.height} />
        <defs className='player-defs'>
          {Object.keys(data.playerStats).map((id) => {
            let player = data.playerStats[id]

            return (
              <pattern key={id} id={`player-portrait-${id}`} width={32} height={32}>
                <image xlinkHref={`${window.Config.ddragon}/img/champion/${player.championName}.png`} width={34} height={34} x={-1} y={-1} />
              </pattern>
            )
          })}
        </defs>
        <g>
          {Object.keys(data.playerStats).sort((a, b) => {
            let playerA = data.playerStats[a]
            let playerB = data.playerStats[b]

            return playerA.h - playerB.h
          }).map((id) => {
            let player = data.playerStats[id]
            let circleProps = {
              key: id,
              r: 16,
              stroke: (player.teamId === 100 ? '#2747e8' : '#cb2124'),
              strokeWidth: 2,
              className: 'player' + (player.h === 0 ? ' player-dead' : ''),
              style: {
                fill: `url(#player-portrait-${id})`,
                transform: `translate(${xScale(player.x)}px, ${yScale(player.y)}px)`,
                transitionDuration: (props.seeking ? `${props.speed}ms` : '0ms')
              }
            }

            return (
              <circle {...circleProps} />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default Minimap
