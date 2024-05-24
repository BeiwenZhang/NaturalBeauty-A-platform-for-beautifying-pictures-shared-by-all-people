package com.zbw.NaturalBeauty.controller;

import com.zbw.NaturalBeauty.common.util.CoreConst;

import com.zbw.NaturalBeauty.model.BizArticle;
import com.zbw.NaturalBeauty.pojo.User;
import com.zbw.NaturalBeauty.service.BizArticleService;
import com.zbw.NaturalBeauty.vo.base.ResponseVo;
import lombok.AllArgsConstructor;
import org.apache.shiro.SecurityUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * 后台文章管理
 *
 * @author Linzhaoguan
 * @version V1.0
 * @date 2019年9月11日
 */
@Controller
@RequestMapping("article")
@AllArgsConstructor
public class ArticleController {

    private final BizArticleService articleService;

    /*文章*/
    @GetMapping("/add")
    public String addArticle(Model model) {
        BizArticle bizArticle = new BizArticle().setOriginal(1).setSlider(0).setTop(0).setRecommended(0).setComment(1);
        model.addAttribute("article", bizArticle);
        return CoreConst.ADMIN_PREFIX + "article/publish";
    }

    @PostMapping("/add")
    @ResponseBody
    @Transactional
    @CacheEvict(value = "article", allEntries = true)
    public void add(BizArticle bizArticle) {
        try {
            User user = (User) SecurityUtils.getSubject().getPrincipal();
//            bizArticle.setUserId(user.getUserId());
            articleService.insertArticle(bizArticle);
//            return ResultUtil.success("保存文章成功");
        } catch (Exception e) {
//            return ResultUtil.error("保存文章失败");
        }
    }

//    @PostMapping("/delete")
//    @ResponseBody
//    public ResponseVo delete(Integer id) {
//        return deleteBatch(new Integer[]{id});
//    }

    @PostMapping("/batch/delete")
    @ResponseBody
    public void deleteBatch(@RequestParam("ids[]") Integer[] ids) {
        int i = articleService.deleteBatch(ids);
        if (i > 0) {
//            return ResultUtil.success("删除文章成功");
        } else {
//            return ResultUtil.error("删除文章失败");
        }
    }
}
