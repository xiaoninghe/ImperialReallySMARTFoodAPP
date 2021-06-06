import React, { useState } from "react";
import PropTypes from "prop-types";
import Layout from "../components/_Layout";
import { Grid, Typography, Container } from "@material-ui/core";
import Tile from "../components/Tile";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import BackButton from "../components/BackButton";
import Masonry from "react-masonry-css";
import axios from "axios";
import { useIngredients, useIngredientsUpdate } from "../contexts/ingredients";
import useSWR from "swr";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Abril Fatface",
    [theme.breakpoints.down("xs")]: {
      fontSize: 72,
    },
  },
  recipeTileContainer: {
    margin: 0,
    width: "90%",
    maxWidth: theme.spacing(180),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
}));

export default function ValidRecipes() {
  const classes = useStyles();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const breakpoints = {
    default: 4,
    1100: 3,
    900: 2,
  };

  const ingredients = useIngredients();
  const fetcher = (url) =>
    axios.get(url).then((res) => {
      setLoading(false);
      return res.data;
    });
  const { data, error } = useSWR(
    `http://smart-food-app-backend.herokuapp.com/recipes/${ingredients.join(
      "_"
    )}`,
    fetcher
  );
  const recipes = data;
  const hasValidRecipes = Array.isArray(recipes);

  const LoadingRecipe = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Skeleton variant="rect" animation="wave" height={200} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rect" animation="wave" height={200} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rect" animation="wave" height={200} />
        </Grid>
      </Grid>
    );
  };

  return (
    <Layout title="Recipes you can make...">
      <Grid container justify="space-evenly" alignItems="center">
        <Grid item>
          <Typography className={classes.title} variant="h1" gutterBottom>
            {loading
              ? "Loading..."
              : hasValidRecipes
              ? `Recipes you can make...`
              : `No recipes found :(`}
          </Typography>
        </Grid>
        <Grid item>
          <BackButton
            href="/"
            message="Edit Ingredients"
            ingredientList={router.query.ingredientList}
          />
        </Grid>
      </Grid>

      <Container style={{ marginTop: 20 }}>
        {loading ? (
          <LoadingRecipe />
        ) : hasValidRecipes ? (
          <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {recipes.map((recipe, i) => (
              <div key={recipe.id}>
                <Tile
                  recipe={recipe}
                  ingredientList={router.query.ingredientList}
                  key={i}
                />
              </div>
            ))}
          </Masonry>
        ) : (
          `Unfortunately, we weren't able to find recipes for all your ingredients this time. Please try again with other ingredients.`
        )}
      </Container>
    </Layout>
  );
}
