var Card =  Vue.component('card', {
	template:`<div class="card" :class="{'card-plain': plain}">
    <h6 class="card-category" v-if="$slots.category || category">{{category}}</h6>
    <div class="card-image" v-if="$slots.image">
      <slot name="image"></slot>
    </div>
    <div class="card-header" :class="headerClasses" v-if="$slots.header || title">
      <slot name="header">
        <h1 v-if="title" class="card-title">{{title}}</h1>
        <h3 v-if="subTitle" class="card-category">{{subTitle}}</h3>
        <p v-if="description" class="card-description">{{description}}</p>
      </slot>
    </div>
    <slot name="raw-content"></slot>
    <div v-if="$slots.default" class="card-body" :class="cardBodyClasses">
      <slot></slot>
    </div>
    <hr v-if="$slots.footer && !noFooterLine">
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>`
  ,props: {
      title: String,
      subTitle: String,
      category: String,
      description: String,
      noFooterLine: Boolean,
      plain: Boolean,
      cardBodyClasses: [String, Object, Array],
      headerClasses: [String, Object, Array]
    }
  });
