package com.zbw.NaturalBeauty.mapper;

import com.zbw.NaturalBeauty.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

//mybatis mapper
@Mapper
@Repository
public interface UserMapper {
    List<User> queryUserList();

    User queryUserById(int id);

    int addUser(User user);

    int updateUser(User user);

    int deleteUserById(int id);

    Integer checkUserID(Map<String,Object> map);

    Integer checkUserName(Map<String,Object> map);

    int updateUserInfo(User user);
}
