# Spatial Extent to Heatmap Prototype
Worked by: Ben Sultzer

# Explanation of Ticket ([EDSC-4635]https://bugs.earthdata.nasa.gov/browse/EDSC-4635)
This ticket is contained within the Epic "[Describe Spatial Extent as a Heatmap]https://bugs.earthdata.nasa.gov/browse/EDSC-4365". The first and most important part of this Epic was to determine what data conversion is actually happening: **Frequency of measurement --> Color**.
<br/><br/>
The Epic specifically asks for the option to display granules as a heatmap layer on the world map. The color on the heatmap will be determine by where a granule falls in the temporal extent of its containing collection. The more frequent a time within the collection receives data ameasurements (granules) the "hotter" the layer will appear. The more infrequent measurements are received, the "cooler" the layer will appear. The layer is intended to describe measurement frequency as a function of granule time/spacial extent. The user will be able to see what kinds of measurements are being taken more often over time and at what location(s) within the **collection's spatial extent** measurements are being taken more often as well.

## Explanation of the Code
All of the functionality is contained within the file `spatialToHeatmap.ts` within this directory. The file targets a specific collection (for testing) by setting a conceptId and then retrieving that collection's metadata and granules.
<br/><br/>
The code creates a frequency scale by taking the temporal extent of the collection and dividing it into 5 partitions. Each partition is assigned a color, starting at blue for less frequent and ending at orange for more frequent. White is used as the middle/average color. `spatialToHeatmap.ts` does not actually perform any color calculations, it only uses numeric representations of each color for simplicity.
<br/><br/>
The code takes the frequency scale and goes through the list of granules, comparing the **`timeStart`** value for each granule to each partition of the frequency scale. The array that stores the partitions is called `COLOR_PARTITIONS`. When a partition marker is found that is greater than `timeStart`, the granule is assigned the corresponding position in the `HEATMAP` 2D array. The `COLOR_PARTITIONS` 1D array contains 6 elements. The difference between the values stored in subsequent elements represents a range. This means that the `HEATMAP` 2D array contains 5 elements. Each element of the `HEATMAP` array represents the **ranges** between each element in the `COLOR_PARTITIONS` array. For example:
<br/><br/>
`partition = [1, 3, 5, 7, 9]`
`heatmapIndices = [0, 1, 2, 3, 4]`
`timeStart = 4`

In the above code, `spatialToHeatmap.ts` would identify the `timeStart` value being between 3 and 5, so `timeStart` would be assigned to element 1 of `heatmapIndices` becuase it represents the values between 3 and 5.
<br/><br/>
Regardless of the number of granules, all granules will be categorized into 1 of these 5 partitions ranges, each receiving a color assignment. The `HEATMAP` array is a 2D array because each of it's elements stores an array that contains all the granules of the same color.

## Anticipated Output
Once the `HEATMAP` array is constructed, the main React frontend will use this data to assign a fill color to each granule shape that is normally drawn on the map. Normally granules are drawn as green semi-transparent shapes, but the user will be given the option to enable a heatmap layer that instead fills each granule with a semi-transparent color that matches their `COLOR_PARTITIONS` color. There will also need to be some kind of gradient applied to the edges of granules to create the appearance of a heatmap with smooth transitions (although when a granule is selected in the "Search Results" window, it's borders will still be outlined as normal)

# IMPORTANT
`spatialToHeatmap.ts` only has the algorithm and logic skeleton right now! The code should organize the granules correctly, but requires further debugging. No other integration with the rest of the EDSC frontend has been implemented!