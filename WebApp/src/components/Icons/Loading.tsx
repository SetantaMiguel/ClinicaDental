export default function LoadingIcon() {
  const iconHtml = `

    <animated-icons
      src="https://animatedicons.co/get-icon?name=Loading&style=minimalistic&token=68399f80-d0bb-4976-b417-1153937b9c51"
      trigger="loop"
      attributes='{"variationThumbColour":"#FFFFFF","variationName":"Normal","variationNumber":1,"numberOfGroups":1,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#000000","background":"#FFFFFF"}}'
      height="200"
      width="200"
    ></animated-icons>

  `;

  return <div dangerouslySetInnerHTML={{ __html: iconHtml }} />;
};
