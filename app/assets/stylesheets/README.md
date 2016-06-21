Earthdata Search
================

Z Indexes
---------

The following are the z-index ranges used by the application.  For normal elements, use the lowest z-index
in the appropriate category.  For popover layers, such as help, use the highest z-index.

### -1 Below the map

-1 may be used in the rare circumstance that something needs to appear below the map

### 0 to 49 - The map

0 Contains the base layer as selected from the layer switching control

1 through 9 contain additional opaque layers added by visualized datasets

10 Contains any overlay layers as selected from the layer switching control

11 through 19 contain additional overlay layers added by visualized datasets

20 contains controls

21 through 49 are reserved for future use

### 50 to 59 - The top of the map

50 to 59 may be used by components which need to appear above the map but below any overlays

### 60 to 69 - Overlays

60 through 69 are for components that obscure the map and its controls, such as the master overlay

### 70 to 79 - Toolbars

70 through 79 are reserved for toolbar components

### 80 to 89 - Landing page

80 contains the base of the landing page

81 through 89 contain components drawn on top of the landing page

### 90 to 99 - Pop-over widgets

90 through 99 contain widgets such as dropdowns or popovers which generally want to appear over everything

### 200 to 299 - Absolute-in-relative

200 through 299 are flags to indicate that a z-index deals with an absolutely positioned element within a
relatively positioned container.  These z-indexes only apply within the relatively-positioned container, so
developers may use them for any purpose specific to that container.

### 1000 - Top hat and footer

1000 is reserved for use by the top hat and footer, which appear over everything at all times