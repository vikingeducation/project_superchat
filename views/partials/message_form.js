<div class="form form-group">
  <form id="messageForm">
    <input type="text" name="message" class="form-control"/>
    <button>Send Message</button>
  </form>
</div>

<div id="allMessages" class="container">
  {{#each messages as |message|}}
    <div class="message row">
      <div class="col-xs-12">
        <p>
          {{message.body}}
        </p>
        <p>
          {{message.author}}
        </p>
      </div>
    </div>
  {{/each}}
</div>
