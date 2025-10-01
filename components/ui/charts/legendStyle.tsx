  export const renderLegend = (props: { payload: any }) => {
    const { payload } = props;
    return (
      <ul
        style={{
          listStyle: "none",
          marginTop: 5,
          display: "flex",
          justifyContent: "center",
          columnGap: 20,
        }}
      >
        {payload.map(
          (
            entry: {
              color: any;
              value: any;
            },
            index: any
          ) => (
            <li
              key={`item-${index + 1}`}
              style={{
                color: "#141414",
                marginBottom: "5px",
                textTransform: "capitalize",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderWidth: "1px",
                  borderColor: "#14141440",
                  borderRadius: 2,
                  backgroundColor: entry.color,
                  marginRight: "5px",
                }}
              ></span>
              {entry.value}
            </li>
          )
        )}
      </ul>
    );
  };