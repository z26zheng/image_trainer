import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import {IMAGEITEMS, ImageItem} from './train_labels';
import Container from '@material-ui/core/Container';
import {Autocomplete} from '@material-ui/lab';
import {TextField} from '@material-ui/core';


interface ImageDataProps {
  classes: any,
}

interface ImageDataState {
    allImages: Array<ImageItem>;
    allLabels: Array<string>;
    selectedLabels: Set<string>;
}

export class ImageData extends React.PureComponent<ImageDataProps, ImageDataState> {

    constructor(props: ImageDataProps) {
      super(props);
      const allLabelsSet = new Set();
      for (var imageItem of IMAGEITEMS) {
          allLabelsSet.add(imageItem['Label'])
      }

      this.state = {
          allImages: IMAGEITEMS,
          allLabels: Array.from(allLabelsSet.values()).sort() as Array<string>,
          selectedLabels: new Set(),
      }
    }

    private getFilteredImages(): Array<ImageItem> {
        const {selectedLabels} = this.state;
        let filteredImages = IMAGEITEMS;
        if (selectedLabels.size !== 0) {
            filteredImages = IMAGEITEMS.filter(function (imageItem) {
                return selectedLabels.has(imageItem['Label']);
            });
        }
        return filteredImages;
    }

    private handleOnChange(event: Object, newValues: string[]) {
        this.setState(prevState => {
            return {
                ...prevState,
                selectedLabels: new Set(newValues),
            }
        })
    }

    render() {
      const {classes} = this.props;
      const imageItems = this.getFilteredImages();

      return (
        <>
          <Container className={classes.searchArea} maxWidth={false}>
              <Autocomplete
                className={classes.labelFilter}
                multiple
                id="tags-standard"
                options={this.state.allLabels}
                getOptionLabel={(option) => option}
                defaultValue={[]}
                onChange={(event, newValues) => this.handleOnChange(event, newValues)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Image Labels"
                    placeholder="Image Labels"
                  />
                )}
              />
          </Container>
          <Container className={classes.cardGrid} maxWidth="md">
            <Grid container spacing={4}>
              {imageItems.map((imageItem) => (
                <Grid item key={imageItem['Img_Name']} xs={12} sm={6} md={4}>
                  <Card className={classes!.card}>
                    <CardMedia
                      className={classes!.cardMedia}
                      image={require('./all_images/'.concat(imageItem['Img_Name'])).default}
                      title={imageItem['Img_Name']}
                    />
                    <CardContent className={classes!.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {imageItem['Img_Name']}
                      </Typography>
                      <Typography>
                        Top: {imageItem['Top']}<br/>
                        Left: {imageItem['Left']}<br/>
                        Width: {imageItem['Width']}<br/>
                        Height: {imageItem['Height']}<br/>
                        Label: <b>{imageItem['Label']}</b><br/>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      )
    }
}

