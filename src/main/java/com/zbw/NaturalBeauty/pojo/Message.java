package com.zbw.NaturalBeauty.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 浏览器发送给服务器的websocket数据.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    private int msgType;
    /** 接收方*/
    private String fromName;
    /** 发送的数据 */
    private String message;

}
