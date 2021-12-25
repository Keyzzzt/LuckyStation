import React from 'react'

type Props = {
  value: number | undefined
  reviews: number | undefined
  text?: string
  color?: string
}

export const Rating: React.FC<Props> = ({
  value,
  reviews,
  color = '#09c',
}) => {
  return (
    <div className="rating">
      <span>
        <i
          style={{ color }}
          className={
            value
              ? value >= 1
                ? 'fas fa-star'
                : value >= 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
              : ''
          }
        ></i>
        <i
          style={{ color }}
          className={
            value
              ? value >= 2
                ? 'fas fa-star'
                : value >= 1.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
              : ''
          }
        ></i>
        <i
          style={{ color }}
          className={
            value
              ? value >= 3
                ? 'fas fa-star'
                : value >= 2.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
              : ''
          }
        ></i>
        <i
          style={{ color }}
          className={
            value
              ? value >= 4
                ? 'fas fa-star'
                : value >= 3.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
              : ''
          }
        ></i>
        <i
          style={{ color }}
          className={
            value
              ? value >= 5
                ? 'fas fa-star'
                : value >= 4.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
              : ''
          }
        ></i>
      </span>
      <span>
        {reviews === 0
          ? ' No reviews'
          : `Total reviews ${reviews}`}
      </span>
    </div>
  )
}
