package com.zbw.NaturalBeauty.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BeautifyImagesInfo {
    private int x;
    private int y;
    private String type;
    private int color;
}
