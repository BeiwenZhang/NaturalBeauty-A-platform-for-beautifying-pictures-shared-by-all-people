package com.zbw.NaturalBeauty.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User extends Object {
    private int id;
    private String name;
    private String pwd;
    private String constellation;  // 新添加的字段：星座
    private String MBTI;  // 新添加的字段：生日
    private String gender;  // 新添加的字段：性别
    private boolean isVip;  // 新添加的字段：是否是 VIP

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;

        User user = (User) obj;
        return id == user.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
