interface Props {
    styles: string,
    text: string
}

export default function SmallText({styles, text}: Props) {
  return (
        <small className={styles}>{text}</small>
  )
}