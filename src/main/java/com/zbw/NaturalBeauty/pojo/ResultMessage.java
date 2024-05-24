package com.zbw.NaturalBeauty.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 服务端发送给客户端的消息.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultMessage {
    public final static int LOGIN_CODE = 1;
    public final static int LOGOUT_CODE = 2;
    public final static int MESSAGE_CODE = 3;
    public final static int BeautifyImages_MOUSE_DOWN_CODE = 4;
    public final static int BeautifyImages_MOUSE_RELEASE_CODE = 5;
    public final static int BeautifyImages_CLEAR_CODE = 6;
    /**
     * 是否是系统消息
     */
    private int msgType;
    /**
     * 发送方Name
     */
    private String fromName;
    /**
     * 发送的数据
     */
    private Object message;

}
