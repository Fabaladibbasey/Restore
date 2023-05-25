import { Box, Typography } from "@mui/material";
import Slider from "react-slick";

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const imgStyle = {
    height: "calc(100vh - 200px)",
    width: "100%",
    margin: "0 auto",
  };
  return (
    <>
      <Slider {...settings}>
        <div style={imgStyle}>
          <img src="/images/hero1.jpg" alt="hero img" style={imgStyle} />
        </div>
        <div style={imgStyle}>
          <img src="/images/hero2.jpg" alt="hero img" style={imgStyle} />
        </div>
        <div style={imgStyle}>
          <img src="/images/hero3.jpg" alt="hero img" style={imgStyle} />
        </div>
      </Slider>

      <Box display="flex" justifyContent={"center"} sx={{ p: 4 }}>
        <Typography variant="h1">Welcome to the store</Typography>
      </Box>
    </>
  );
}
export default Home;
